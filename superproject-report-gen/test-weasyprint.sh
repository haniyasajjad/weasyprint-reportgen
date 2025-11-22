#!/bin/bash
# Save this as test-weasyprint.sh and run: bash test-weasyprint.sh

echo "Testing WeasyPrint Python script..."

# Create test data
cat > /tmp/test_input.json << 'EOF'
{
  "outputPath": "/tmp/test_output.pdf",
  "data": {
    "superproject": {
      "sproid": "TEST123",
      "projectTitle": "Test Project",
      "companyName": "Test Company",
      "dateCreated": "2024-01-01"
    },
    "statistics": {
      "totalProjects": 1,
      "totalSections": 2,
      "totalDefects": 3
    },
    "projects": [
      {
        "proid": "PRO1",
        "projectTitle": "Test Road Project",
        "streetName": "Main Street",
        "sections": [
          {
            "sectionId": "SEC1",
            "pci": 85.5,
            "cci": 90.2,
            "defects": [
              {
                "defectType": 1,
                "severity": 2,
                "length": 1.5,
                "defectWidth": 0.3
              }
            ]
          }
        ]
      }
    ]
  }
}
EOF

echo "Test data created at /tmp/test_input.json"
echo ""
echo "Running Python script..."
echo ""

# Test the Python script
cat /tmp/test_input.json | python3 src/reportgen/weasyprint/generator.py

# Check exit code
if [ $? -eq 0 ]; then
    echo ""
    echo "✅ SUCCESS! Python script executed without errors"
    echo ""
    if [ -f "/tmp/test_output.pdf" ]; then
        echo "✅ PDF file created: /tmp/test_output.pdf"
        ls -lh /tmp/test_output.pdf
        echo ""
        echo "Opening PDF..."
        open /tmp/test_output.pdf
    else
        echo "❌ PDF file not found at /tmp/test_output.pdf"
    fi
else
    echo ""
    echo "❌ FAILED! Python script exited with error code: $?"
fi

# Cleanup
rm /tmp/test_input.json