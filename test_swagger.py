#!/usr/bin/env python3
"""
Test script to verify Flasgger documentation is working
"""

import requests
import json
import sys


def test_swagger_ui():
    """Test if Swagger UI is accessible"""
    try:
        response = requests.get("http://localhost:5000/apidocs/")
        if response.status_code == 200:
            print("✅ Swagger UI is accessible at http://localhost:5000/apidocs/")
            return True
        else:
            print(f"❌ Swagger UI returned status code: {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("❌ Could not connect to the server. Make sure it's running on localhost:5000")
        return False
    except Exception as e:
        print(f"❌ Error accessing Swagger UI: {e}")
        return False


def test_api_spec():
    """Test if API specification JSON is accessible"""
    try:
        response = requests.get("http://localhost:5000/apispec_1.json")
        if response.status_code == 200:
            spec = response.json()
            print("✅ API specification is accessible")
            print(
                f"   API Title: {spec.get('info', {}).get('title', 'Unknown')}")
            print(
                f"   API Version: {spec.get('info', {}).get('version', 'Unknown')}")
            print(f"   Available endpoints: {len(spec.get('paths', {}))}")

            # List all endpoints
            for path, methods in spec.get('paths', {}).items():
                for method in methods.keys():
                    if method.upper() in ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']:
                        print(f"   - {method.upper()} {path}")
            return True
        else:
            print(
                f"❌ API specification returned status code: {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("❌ Could not connect to the server. Make sure it's running on localhost:5000")
        return False
    except Exception as e:
        print(f"❌ Error accessing API specification: {e}")
        return False


def test_health_endpoint():
    """Test the health check endpoint"""
    try:
        response = requests.get("http://localhost:5000/")
        if response.status_code == 200:
            print("✅ Health endpoint is working")
            print(f"   Response: {response.text}")
            return True
        else:
            print(
                f"❌ Health endpoint returned status code: {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("❌ Could not connect to the server. Make sure it's running on localhost:5000")
        return False
    except Exception as e:
        print(f"❌ Error accessing health endpoint: {e}")
        return False


def main():
    """Run all tests"""
    print("Testing Flasgger Documentation Setup")
    print("=" * 40)

    tests = [
        test_health_endpoint,
        test_swagger_ui,
        test_api_spec
    ]

    results = []
    for test in tests:
        print(f"\nRunning {test.__name__}...")
        results.append(test())

    print("\n" + "=" * 40)
    print("Test Summary:")
    passed = sum(results)
    total = len(results)
    print(f"Passed: {passed}/{total}")

    if passed == total:
        print("🎉 All tests passed! Your Flasgger documentation is working correctly.")
        print("\nTo view the documentation:")
        print("1. Start your Flask server: python server.py")
        print("2. Open your browser and go to: http://localhost:5000/apidocs/")
    else:
        print("❌ Some tests failed. Make sure your Flask server is running.")
        sys.exit(1)


if __name__ == "__main__":
    main()
