#!/usr/bin/env python3
"""
Optimized WeasyPrint PDF Generator for Large Reports
Handles 500-1000 page reports with 10,000+ sections and 50,000+ defects
Text-only, no images - optimized for speed
"""

import sys
import json
from weasyprint import HTML, CSS
from datetime import datetime
import io

# Optimized CSS for fast rendering - text only, minimal styling
OPTIMIZED_CSS = """
@page {
    size: A4;
    margin: 1.5cm 1cm;
    
    @bottom-right {
        content: "Page " counter(page) " of " counter(pages);
        font-size: 8pt;
        color: #999;
    }
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Helvetica', 'Arial', sans-serif;
    font-size: 9pt;
    line-height: 1.3;
    color: #333;
}

h1 {
    font-size: 20pt;
    margin-bottom: 0.3cm;
    page-break-after: avoid;
    margin-top: 0;
}

h2 {
    font-size: 12pt;
    margin-top: 0.3cm;
    margin-bottom: 0.2cm;
    page-break-after: avoid;
}

h3 {
    font-size: 10pt;
    margin-top: 0.2cm;
    margin-bottom: 0.15cm;
    page-break-after: avoid;
}

.section-info, .project-info {
    page-break-inside: avoid;
    margin-bottom: 0.2cm;
}

.info-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.15cm;
    margin-bottom: 0.15cm;
}

.info-row {
    font-size: 8pt;
    padding: 0.02cm 0;
    display: flex;
}

.label {
    font-weight: bold;
    color: #444;
    width: 40%;
}

.value {
    color: #333;
    width: 60%;
}

.defect-table {
    width: 100%;
    border-collapse: collapse;
    margin: 0.2cm 0;
    font-size: 7pt;
    line-height: 1.2;
}

.defect-table th {
    background: #f0f0f0;
    padding: 0.05cm 0.1cm;
    text-align: left;
    border: 0.5pt solid #ddd;
    font-weight: bold;
}

.defect-table td {
    padding: 0.05cm 0.1cm;
    border: 0.5pt solid #ddd;
}

.cover-page {
    text-align: center;
    padding-top: 3cm;
    page-break-after: always;
}

.summary-section {
    margin: 0.3cm 0;
    padding: 0.2cm;
    background: #f9f9f9;
    page-break-inside: avoid;
}

.stat-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.2cm;
    margin-top: 0.2cm;
}

.stat-box {
    padding: 0.15cm;
    background: white;
    border: 0.5pt solid #ddd;
    text-align: center;
}

.stat-value {
    font-size: 14pt;
    font-weight: bold;
    color: #2c5aa0;
}

.stat-label {
    font-size: 8pt;
    color: #666;
}

table { table-layout: fixed; }
"""

def format_value(value):
    """Format value for display, handle None/null cases"""
    if value is None or value == 'null' or value == '':
        return 'N/A'
    if isinstance(value, float):
        return f"{value:.2f}"
    return str(value)

def generate_cover_page(data):
    """Generate cover page"""
    superproject = data.get('superproject', {})
    stats = data.get('statistics', {})
    
    return f"""
    <div class="cover-page">
        <h1>{format_value(superproject.get('projectTitle', 'Superproject Report'))}</h1>
        <p style="font-size: 12pt; margin: 1cm 0;">
            Superproject ID: {format_value(superproject.get('sproid'))}
        </p>
        <p style="font-size: 10pt; color: #666;">
            Generated on: {datetime.now().strftime('%B %d, %Y at %H:%M')}
        </p>
        
        <div class="summary-section" style="margin-top: 3cm; text-align: left;">
            <h3>Report Summary</h3>
            <div class="stat-grid">
                <div class="stat-box">
                    <div class="stat-value">{stats.get('totalProjects', 0)}</div>
                    <div class="stat-label">Projects</div>
                </div>
                <div class="stat-box">
                    <div class="stat-value">{stats.get('totalSections', 0)}</div>
                    <div class="stat-label">Sections</div>
                </div>
                <div class="stat-box">
                    <div class="stat-value">{stats.get('totalDefects', 0)}</div>
                    <div class="stat-label">Defects</div>
                </div>
            </div>
        </div>
    </div>
    """

def generate_superproject_info(superproject):
    """Generate superproject information section"""
    return f"""
    <div class="section-info">
        <h2>Superproject Information</h2>
        <div class="info-grid">
            <div class="info-row">
                <span class="label">ID:</span> 
                <span class="value">{format_value(superproject.get('sproid'))}</span>
            </div>
            <div class="info-row">
                <span class="label">Title:</span> 
                <span class="value">{format_value(superproject.get('projectTitle'))}</span>
            </div>
            <div class="info-row">
                <span class="label">Company:</span> 
                <span class="value">{format_value(superproject.get('companyName'))}</span>
            </div>
            <div class="info-row">
                <span class="label">Road Side:</span> 
                <span class="value">{format_value(superproject.get('roadSide'))}</span>
            </div>
            <div class="info-row">
                <span class="label">Creator:</span> 
                <span class="value">{format_value(superproject.get('creatorUid'))}</span>
            </div>
            <div class="info-row">
                <span class="label">Date Created:</span> 
                <span class="value">{format_value(superproject.get('dateCreated', '').split('T')[0] if superproject.get('dateCreated') else 'N/A')}</span>
            </div>
        </div>
    </div>
    """

def generate_project_section(project):
    """Generate project information section"""
    return f"""
    <div class="project-info">
        <h3>Project: {format_value(project.get('projectTitle', project.get('proid')))}</h3>
        <div class="info-grid">
            <div class="info-row">
                <span class="label">Project ID:</span> 
                <span class="value">{format_value(project.get('proid'))}</span>
            </div>
            <div class="info-row">
                <span class="label">Street:</span> 
                <span class="value">{format_value(project.get('streetName'))}</span>
            </div>
            <div class="info-row">
                <span class="label">Direction:</span> 
                <span class="value">{format_value(project.get('direction'))}</span>
            </div>
            <div class="info-row">
                <span class="label">Lanes:</span> 
                <span class="value">{format_value(project.get('totalLanes'))}</span>
            </div>
            <div class="info-row">
                <span class="label">Survey Date:</span> 
                <span class="value">{format_value(project.get('surveyDate', '').split('T')[0] if project.get('surveyDate') else 'N/A')}</span>
            </div>
            <div class="info-row">
                <span class="label">Road Type:</span> 
                <span class="value">{format_value(project.get('typeOfRoad'))}</span>
            </div>
        </div>
    </div>
    """

def generate_sections_with_defects(sections_data, batch_size=50):
    """
    Generate sections with their defects in batches for memory efficiency.
    Uses generator pattern to avoid building entire HTML in memory.
    """
    for i in range(0, len(sections_data), batch_size):
        batch = sections_data[i:i + batch_size]
        
        for section in batch:
            # Section header
            html = f"""
            <div class="section-info">
                <h3>Section: {format_value(section.get('sectionId'))}</h3>
                <div class="info-grid">
                    <div class="info-row">
                        <span class="label">PCI:</span> 
                        <span class="value">{format_value(section.get('pci'))}</span>
                    </div>
                    <div class="info-row">
                        <span class="label">CCI:</span> 
                        <span class="value">{format_value(section.get('cci'))}</span>
                    </div>
                    <div class="info-row">
                        <span class="label">RCI:</span> 
                        <span class="value">{format_value(section.get('rci'))}</span>
                    </div>
                    <div class="info-row">
                        <span class="label">Distance:</span> 
                        <span class="value">{format_value(section.get('distance'))} m</span>
                    </div>
                </div>
            """
            
            # Defects table if any
            defects = section.get('defects', [])
            if defects:
                html += """
                <table class="defect-table">
                    <thead>
                        <tr>
                            <th>Type</th>
                            <th>Severity</th>
                            <th>Length</th>
                            <th>Width</th>
                            <th>Area</th>
                            <th>Depth</th>
                        </tr>
                    </thead>
                    <tbody>
                """
                
                for defect in defects:
                    html += f"""
                    <tr>
                        <td>{format_value(defect.get('defectType'))}</td>
                        <td>{format_value(defect.get('severity'))}</td>
                        <td>{format_value(defect.get('length'))}</td>
                        <td>{format_value(defect.get('defectWidth'))}</td>
                        <td>{format_value(defect.get('area'))}</td>
                        <td>{format_value(defect.get('depth'))}</td>
                    </tr>
                    """
                
                html += "</tbody></table>"
            
            html += "</div>"
            yield html

def generate_html(data):
    """Generate complete HTML for the report with memory-efficient streaming"""
    html_parts = [
        '<!DOCTYPE html>',
        '<html>',
        '<head>',
        '<meta charset="UTF-8">',
        '<title>Superproject Report</title>',
        '</head>',
        '<body>',
        generate_cover_page(data),
        generate_superproject_info(data.get('superproject', {}))
    ]
    
    # Add projects and their sections
    projects = data.get('projects', [])
    for project in projects:
        html_parts.append(generate_project_section(project))
        sections = project.get('sections', [])
        if sections:
            # Use generator to stream sections and defects
            for section_html in generate_sections_with_defects(sections):
                html_parts.append(section_html)
    
    html_parts.extend(['</body>', '</html>'])
    
    return ''.join(html_parts)

def generate_pdf(data, output_path):
    """
    Main PDF generation function with progress tracking
    
    Args:
        data: Dictionary containing report data
        output_path: Path where PDF should be saved
    
    Returns:
        Dictionary with generation statistics
    """
    try:
        start_time = datetime.now()
        import sys
        
        # Calculate data metrics for progress logging
        total_projects = len(data.get('projects', []))
        total_sections = sum(len(p.get('sections', [])) for p in data.get('projects', []))
        total_defects = sum(
            sum(len(s.get('defects', [])) for s in p.get('sections', []))
            for p in data.get('projects', [])
        )
        
        sys.stderr.write(f"Data: {total_projects} projects, {total_sections} sections, {total_defects} defects\n")
        sys.stderr.flush()
        
        # Generate HTML
        sys.stderr.write("Generating HTML...\n")
        sys.stderr.flush()
        html_start = datetime.now()
        html_content = generate_html(data)
        html_end = datetime.now()
        html_duration = (html_end - html_start).total_seconds()
        sys.stderr.write(f"HTML generated in {html_duration:.2f}s\n")
        sys.stderr.flush()
        
        # Create PDF with optimized settings
        sys.stderr.write("Creating PDF document...\n")
        sys.stderr.flush()
        pdf_start = datetime.now()
        
        html_doc = HTML(string=html_content, base_url='.')
        css_doc = CSS(string=OPTIMIZED_CSS)
        
        # Generate PDF with optimization flags
        html_doc.write_pdf(
            output_path,
            stylesheets=[css_doc],
            optimize_size=('fonts',),
        )
        
        pdf_end = datetime.now()
        pdf_duration = (pdf_end - pdf_start).total_seconds()
        sys.stderr.write(f"PDF written in {pdf_duration:.2f}s\n")
        sys.stderr.flush()
        
        end_time = datetime.now()
        duration = (end_time - start_time).total_seconds()
        
        sys.stderr.write(f"Total generation time: {duration:.2f}s\n")
        sys.stderr.flush()
        
        return {
            'success': True,
            'path': output_path,
            'duration_seconds': duration,
            'timestamp': end_time.isoformat()
        }
        
    except Exception as e:
        import sys
        sys.stderr.write(f"Error during PDF generation: {str(e)}\n")
        sys.stderr.flush()
        return {
            'success': False,
            'error': str(e),
            'timestamp': datetime.now().isoformat()
        }

def main():
    """Main entry point for the script"""
    try:
        # Log to stderr for debugging (won't interfere with JSON output)
        import sys
        sys.stderr.write("WeasyPrint generator starting...\n")
        sys.stderr.flush()
        
        # Read input from stdin
        sys.stderr.write("Reading input from stdin...\n")
        sys.stderr.flush()
        
        input_text = sys.stdin.read()
        
        sys.stderr.write(f"Received {len(input_text)} bytes of input\n")
        sys.stderr.flush()
        
        input_data = json.loads(input_text)
        
        # Extract data and output path
        report_data = input_data.get('data', {})
        output_path = input_data.get('outputPath')
        
        if not output_path:
            raise ValueError("Output path is required")
        
        sys.stderr.write(f"Output path: {output_path}\n")
        sys.stderr.flush()
        
        # Generate PDF
        sys.stderr.write("Generating PDF...\n")
        sys.stderr.flush()
        
        result = generate_pdf(report_data, output_path)
        
        sys.stderr.write("PDF generation complete\n")
        sys.stderr.flush()
        
        # Output result as JSON to stdout
        print(json.dumps(result))
        sys.stdout.flush()
        
        # Exit with appropriate code
        sys.exit(0 if result['success'] else 1)
        
    except json.JSONDecodeError as e:
        sys.stderr.write(f"JSON decode error: {str(e)}\n")
        sys.stderr.flush()
        error_result = {
            'success': False,
            'error': f'Invalid JSON input: {str(e)}',
            'timestamp': datetime.now().isoformat()
        }
        print(json.dumps(error_result))
        sys.stdout.flush()
        sys.exit(1)
    except Exception as e:
        sys.stderr.write(f"Error: {str(e)}\n")
        sys.stderr.flush()
        error_result = {
            'success': False,
            'error': str(e),
            'timestamp': datetime.now().isoformat()
        }
        print(json.dumps(error_result))
        sys.stdout.flush()
        sys.exit(1)

if __name__ == "__main__":
    main()