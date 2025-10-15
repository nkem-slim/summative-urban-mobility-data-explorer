import csv
import json
from os import getenv
from models import TripRecord, TripModel  # Pydantic + SQLAlchemy
from pydantic import ValidationError
from sqlalchemy.orm import Session


def validate_row(data: dict, seen_ids: set):
    """Validate and deduplicate one row."""
    try:
        validated = TripRecord.model_validate(data)
        if validated.id in seen_ids:
            raise ValueError(f"id '{validated.id}' already exists in batch")
        seen_ids.add(validated.id)
        return validated, None
    except ValidationError as e:
        return None, e.errors()
    except ValueError as e:
        return None, [{"loc": ["id"], "msg": str(e), "type": "value_error"}]


def save_many_trips(session: Session, trips: list[dict]):
    """Efficient bulk insert for SQLAlchemy."""
    try:
        session.bulk_insert_mappings(TripModel, trips)
        session.commit()
        print(f"✅ Inserted {len(trips)} trips.")
    except Exception as e:
        session.rollback()
        print(f"❌ Bulk insert failed: {e}")
        raise


def to_db(input_csv: str, session: Session, batch_size: int = 10000):
    """
    Stream CSV → validate → insert into DB in batches (efficient for millions of rows).
    Invalid records go to incorrect.json.
    """
    total_inserted = 0
    total_errors = 0
    batch = []
    insertion_limit = 10000
    seen_ids = set()

    with open(input_csv, "r", newline="", encoding="utf-8") as csv_file, \
            open("incorrect.json", "w", encoding="utf-8") as error_stream:

        reader = csv.DictReader(csv_file)

        for i, row in enumerate(reader, start=1):
            validated, errors = validate_row(row, seen_ids)
            if errors:
                total_errors += 1
                json.dump({"row": row, "errors": errors}, error_stream)
                error_stream.write("\n")
                continue

            batch.append(validated.model_dump())

            if len(batch) >= batch_size:
                save_many_trips(session, batch)
                total_inserted += len(batch)
                batch.clear()

            # if getenv("PYTHON_ENV") != "PRODUCTION" and i == insertion_limit:
            #     break

            # if total_inserted % 10_000 == 0:
            #     print(f"Inserted {total_inserted:,} trips so far...")

        # Handle remaining batch
        if batch:
            save_many_trips(session, batch)
            total_inserted += len(batch)

    print(
        f"✅ Done! {total_inserted:,} trips inserted, {total_errors:,} errors logged.")


def to_file(input_csv: str, output_json: str):
    """Stream CSV → validate → write valid rows to JSON + invalid to incorrect.json."""
    total = 0
    errors = 0
    first = True
    seen_ids = set()
    insertion_limit = 10000

    with open(input_csv, "r", newline="", encoding="utf-8") as csv_file, \
            open(output_json, "w", encoding="utf-8") as output_stream, \
            open("incorrect.json", "w", encoding="utf-8") as error_stream:

        reader = csv.DictReader(csv_file)
        output_stream.write("[\n")

        for i, row in enumerate(reader, start=1):
            validated, errs = validate_row(row, seen_ids)
            if errs:
                errors += 1
                json.dump({"row": row, "errors": errs}, error_stream)
                error_stream.write("\n")
                continue

            if not first:
                output_stream.write(",\n")
            json.dump(validated.model_dump(mode="json"), output_stream)
            first = False
            total += 1

            if getenv("PYTHON_ENV") != "PRODUCTION" and i == insertion_limit:
                break

            if total % 10_000 == 0:
                print(f"Processed {total:,} trips so far...")

        output_stream.write("\n]")

    print(f"✅ Done! {total:,} valid trips written, {errors:,} errors logged.")


def clean_data(input_csv: str, output_json: str = None, session: Session = None):
    """Entry point — choose between DB or File mode."""
    if session:
        to_db(input_csv, session)
    elif output_json:
        to_file(input_csv, output_json)
    else:
        raise ValueError(
            "Provide either a SQLAlchemy session or an output JSON path.")
