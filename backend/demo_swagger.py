#!/usr/bin/env python3
"""
Demo script to showcase Flasgger API documentation
This script provides a simple way to start the server and view documentation
"""

import webbrowser
import time
import subprocess
import sys
from pathlib import Path

def print_banner():
    """Print a banner for the demo"""
    print("=" * 60)
    print("🚀 Urban Mobility Data Explorer API with Flasgger")
    print("=" * 60)
    print()

def check_dependencies():
    """Check if required dependencies are installed"""
    print("📋 Checking dependencies...")
    
    try:
        import flask
        print("✅ Flask is installed")
    except ImportError:
        print("❌ Flask is not installed. Please install it first.")
        return False
        
    try:
        import flasgger
        print("✅ Flasgger is installed")
    except ImportError:
        print("❌ Flasgger is not installed. Please install it first.")
        print("   Run: pip install flasgger")
        return False
        
    print("✅ All dependencies are installed")
    return True

def show_available_endpoints():
    """Display available endpoints"""
    print()
    print("📍 Available API Endpoints:")
    print("-" * 30)
    print("GET  /                  - Health check")
    print("POST /trips             - Add a new trip")
    print("GET  /trips             - List all trips") 
    print("GET  /trips/{trip_id}   - Get specific trip")
    print()
    print("📚 Documentation URLs:")
    print("-" * 30)
    print("Swagger UI:   http://localhost:5000/apidocs/")
    print("API Spec:     http://localhost:5000/apispec_1.json")
    print()

def show_example_request():
    """Show example API request"""
    print("💡 Example Trip Data (for POST /trips):")
    print("-" * 40)
    example = '''{
  "id": "id12345",
  "vendor_id": 1,
  "pickup_datetime": "2023-01-15T10:30:00",
  "dropoff_datetime": "2023-01-15T10:45:00", 
  "passenger_count": 2,
  "pickup_longitude": -73.935242,
  "pickup_latitude": 40.730610,
  "dropoff_longitude": -73.925242,
  "dropoff_latitude": 40.740610,
  "store_and_fwd_flag": "N",
  "trip_duration": 900
}'''
    print(example)
    print()

def main():
    """Main demo function"""
    print_banner()
    
    if not check_dependencies():
        sys.exit(1)
        
    show_available_endpoints()
    show_example_request()
    
    print("🔧 To start the server manually:")
    print("   python server.py --storage db")
    print("   python server.py --storage file")
    print()
    
    print("🧪 To test the setup:")
    print("   python test_swagger.py")
    print()
    
    print("📖 To view documentation after starting server:")
    print("   Open browser to: http://localhost:5000/apidocs/")
    print()
    
    # Ask if user wants to start server
    try:
        choice = input("🚀 Would you like to start the demo server now? (y/n): ").strip().lower()
        if choice in ['y', 'yes']:
            print("\n🔄 Starting server with database storage...")
            print("   Press Ctrl+C to stop the server")
            print("   The Swagger UI will open automatically in your browser")
            
            # Give user a moment to read
            time.sleep(2)
            
            # Try to open browser after a short delay
            try:
                # Start the server process
                print("\n⏳ Starting Flask server...")
                subprocess.Popen([
                    sys.executable, "server.py", "--storage", "db"
                ], cwd=Path.cwd())
                
                # Wait a bit for server to start
                time.sleep(3)
                
                # Open browser to Swagger UI
                print("🌐 Opening Swagger UI in browser...")
                webbrowser.open("http://localhost:5000/apidocs/")
                
                print("\n✅ Server should be running!")
                print("   Swagger UI: http://localhost:5000/apidocs/")
                print("   API Health: http://localhost:5000/")
                print("\n   Press Enter to continue or Ctrl+C to exit...")
                input()
                
            except Exception as e:
                print(f"❌ Error starting server: {e}")
                print("   Please start manually: python server.py --storage db")
        else:
            print("\n👋 Demo complete! Start the server manually when ready.")
            
    except KeyboardInterrupt:
        print("\n\n👋 Demo interrupted. Goodbye!")
        sys.exit(0)

if __name__ == "__main__":
    main()