# SpendSmart Project Report

This directory contains the comprehensive project report for SpendSmart in LaTeX format.

## Files Included

- `project_report.tex` - Main LaTeX document containing the complete project report
- `README.md` - This file with compilation instructions

## Report Structure

The report follows the specified format with the following sections:

1. **Cover Page** - Project title and submission details
2. **Certificate** - Project completion certification
3. **Abstract** - Project summary and objectives
4. **Table of Contents** - Auto-generated with page numbers
5. **Introduction** - Project objectives, description, and requirements
6. **Design Description** - Flow charts, DFDs, and ER diagrams
7. **Project Description** - Database design, tables, and forms
8. **Testing and Tools Used** - Testing methodology and development tools
9. **Implementation and Maintenance** - Development phases and deployment
10. **Conclusion and Future Work** - Project outcomes and enhancements
11. **Bibliography** - References and citations

## Compilation Instructions

### Method 1: Online LaTeX Compilers
1. Copy the content of `project_report.tex`
2. Use online LaTeX editors like:
   - Overleaf (https://www.overleaf.com)
   - Papeeria (https://www.papeeria.com)
   - LaTeX Base (https://latexbase.com)

### Method 2: Local LaTeX Installation
1. Install a LaTeX distribution:
   - **Windows**: MiKTeX (https://miktex.org) or TeX Live
   - **macOS**: MacTeX (https://www.tug.org/mactex/)
   - **Linux**: TeX Live (`sudo apt install texlive-full`)

2. Compile the document:
   ```bash
   pdflatex project_report.tex
   pdflatex project_report.tex  # Run twice for table of contents
   ```

### Method 3: Using Docker
```bash
docker run --rm -v $(pwd):/workdir -w /workdir paperist/texlive-2023 pdflatex project_report.tex
```

## Formatting Specifications

The document adheres to the specified formatting requirements:

- **Margins**: 1 inch on all sides
- **Font**: 12pt Times New Roman
- **Line Spacing**: 1.5 lines
- **Justification**: Full justification
- **Page Numbering**: Bottom center (starting from Introduction)
- **Figures/Tables**: Centered with captions
- **References**: Numbered in square brackets

## Customization

Before compilation, update the following placeholders in the LaTeX file:

- `[Student Name]` - Replace with your name
- `[Roll Number]` - Replace with your roll number
- `[Guide Name]` - Replace with your project guide's name
- `[HOD Name]` - Replace with department head's name
- `[College/University Name]` - Replace with your institution name
- `[Location]` - Replace with your location
- `[Department]` - Replace with your department name

## Images Required

The report references several diagram images. You may need to create or obtain:

- `flow_chart.png` - System flow chart
- `dfd_level0.png` - Level 0 Data Flow Diagram
- `dfd_level1.png` - Level 1 Data Flow Diagram
- `er_diagram.png` - Entity-Relationship Diagram

These can be created using tools like:
- Draw.io (https://app.diagrams.net)
- Lucidchart (https://www.lucidchart.com)
- Microsoft Visio
- Or export from the existing Mermaid diagrams in the project

## Notes

- The report is comprehensive and covers all aspects of the SpendSmart project
- All technical details are based on the actual implementation
- The bibliography includes relevant references for the technologies used
- The document is ready for academic submission with proper formatting

## Contact

For any questions or modifications needed, please refer to the project documentation or contact the development team.