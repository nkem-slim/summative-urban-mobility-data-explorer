import json
from pathlib import Path
from abc import ABC, abstractmethod
from typing import List, Dict


class StorageAdapter(ABC):
    @abstractmethod
    def save_trip(self, trip: Dict):
        pass

    @abstractmethod
    def get_trip(self, trip_id: str) -> Dict:
        pass

    @abstractmethod
    def list_trips(self) -> List[Dict]:
        pass

    @abstractmethod
    def delete_trip(self, trip_id: str):
        pass
