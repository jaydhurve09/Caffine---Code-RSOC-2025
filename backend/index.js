const express = require('express');
const PDFDocument = require('pdfkit');
const { Document, Packer, Paragraph, TextRun } = require('docx');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors({
    exposedHeaders: ['Content-Disposition']
}));
app.use(express.json());

// Generate PDF report
app.post('/api/generate-pdf', async (req, res) => {
    try {
        const { repoData } = req.body;
        const doc = new PDFDocument();

        // Set response headers for PDF download
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=github-report.pdf');

        // Pipe the PDF document to the response
        doc.pipe(res);

        // Add content to PDF
        doc.fontSize(25).text('GitHub Repository Analysis Report', { align: 'center' });
        doc.moveDown();
        doc.fontSize(12);

        // Add repository information
        if (repoData) {
            // Basic repository information
            doc.text(`Repository Name: ${repoData.repository?.name || 'N/A'}`);
            doc.text(`Description: ${repoData.repository?.description || 'N/A'}`);
            doc.text(`Stars: ${repoData.repository?.stargazers_count || 0}`);
            doc.text(`Forks: ${repoData.repository?.forks_count || 0}`);
            doc.text(`Watchers: ${repoData.repository?.watchers_count || 0}`);
            doc.moveDown();

            // Issues statistics
            doc.fontSize(16).text('Issues Statistics', { underline: true });
            doc.fontSize(12);
            const openIssues = repoData.issues?.filter(i => i.state === 'open').length || 0;
            const closedIssues = repoData.issues?.filter(i => i.state === 'closed').length || 0;
            doc.text(`Open Issues: ${openIssues}`);
            doc.text(`Closed Issues: ${closedIssues}`);
            doc.moveDown();

            // Pull Requests statistics
            doc.fontSize(16).text('Pull Requests Statistics', { underline: true });
            doc.fontSize(12);
            const openPRs = repoData.pulls?.filter(p => p.state === 'open').length || 0;
            const mergedPRs = repoData.pulls?.filter(p => p.merged_at).length || 0;
            const closedPRs = repoData.pulls?.filter(p => p.state === 'closed' && !p.merged_at).length || 0;
            doc.text(`Open Pull Requests: ${openPRs}`);
            doc.text(`Merged Pull Requests: ${mergedPRs}`);
            doc.text(`Closed Pull Requests: ${closedPRs}`);
            doc.moveDown();

            // Top Contributors
            doc.fontSize(16).text('Top Contributors', { underline: true });
            doc.fontSize(12);
            const topContributors = repoData.contributors?.slice(0, 5) || [];
            topContributors.forEach((contributor, index) => {
                doc.text(`${index + 1}. ${contributor.login} - ${contributor.contributions} contributions`);
            });
        }

        // Finalize the PDF
        doc.end();
    } catch (error) {
        console.error('Error generating PDF:', error);
        res.status(500).json({ error: 'Failed to generate PDF report' });
    }
});

// Generate Word document report
app.post('/api/generate-docx', async (req, res) => {
    try {
        const { repoData } = req.body;

        // Create new Word document
        const doc = new Document({
            sections: [{
                properties: {},
                children: [
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: 'GitHub Repository Analysis Report',
                                bold: true,
                                size: 32
                            })
                        ],
                        spacing: {
                            after: 200
                        }
                    }),
                    // Basic repository information
                    new Paragraph({
                        children: [
                            new TextRun(`Repository Name: ${repoData?.repository?.name || 'N/A'}`)
                        ]
                    }),
                    new Paragraph({
                        children: [
                            new TextRun(`Description: ${repoData?.repository?.description || 'N/A'}`)
                        ]
                    }),
                    new Paragraph({
                        children: [
                            new TextRun(`Stars: ${repoData?.repository?.stargazers_count || 0}`)
                        ]
                    }),
                    new Paragraph({
                        children: [
                            new TextRun(`Forks: ${repoData?.repository?.forks_count || 0}`)
                        ]
                    }),
                    new Paragraph({
                        children: [
                            new TextRun(`Watchers: ${repoData?.repository?.watchers_count || 0}`)
                        ],
                        spacing: { after: 200 }
                    }),
                    // Issues Statistics
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: 'Issues Statistics',
                                bold: true,
                                size: 24
                            })
                        ]
                    }),
                    new Paragraph({
                        children: [
                            new TextRun(`Open Issues: ${repoData?.issues?.filter(i => i.state === 'open').length || 0}`)
                        ]
                    }),
                    new Paragraph({
                        children: [
                            new TextRun(`Closed Issues: ${repoData?.issues?.filter(i => i.state === 'closed').length || 0}`)
                        ],
                        spacing: { after: 200 }
                    }),
                    // Pull Requests Statistics
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: 'Pull Requests Statistics',
                                bold: true,
                                size: 24
                            })
                        ]
                    }),
                    new Paragraph({
                        children: [
                            new TextRun(`Open Pull Requests: ${repoData?.pulls?.filter(p => p.state === 'open').length || 0}`)
                        ]
                    }),
                    new Paragraph({
                        children: [
                            new TextRun(`Merged Pull Requests: ${repoData?.pulls?.filter(p => p.merged_at).length || 0}`)
                        ]
                    }),
                    new Paragraph({
                        children: [
                            new TextRun(`Closed Pull Requests: ${repoData?.pulls?.filter(p => p.state === 'closed' && !p.merged_at).length || 0}`)
                        ],
                        spacing: { after: 200 }
                    }),
                    // Top Contributors
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: 'Top Contributors',
                                bold: true,
                                size: 24
                            })
                        ]
                    }),
                    ...(repoData?.contributors?.slice(0, 5) || []).map((contributor, index) =>
                        new Paragraph({
                            children: [
                                new TextRun(`${index + 1}. ${contributor.login} - ${contributor.contributions} contributions`)
                            ]
                        })
                    )
                ]
            }]
        });

        // Generate the document buffer
        const buffer = await Packer.toBuffer(doc);

        // Set response headers for DOCX download
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
        res.setHeader('Content-Disposition', 'attachment; filename=github-report.docx');

        // Send the buffer
        res.send(buffer);
    } catch (error) {
        console.error('Error generating DOCX:', error);
        res.status(500).json({ error: 'Failed to generate Word document report' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});