import PDFLib from 'react-native-pdf-lib';
import RNFS from 'react-native-fs';

export const generateHisabPDF = async (hisabs, startDate, endDate, personName) => {
  // Filter hisabs by date range
  const filteredHisabs = hisabs.filter(hisab => {
    const hisabDate = new Date(hisab.date);
    return hisabDate >= new Date(startDate) && hisabDate <= new Date(endDate);
  });

  // Calculate total
  const total = filteredHisabs.reduce((sum, hisab) => sum + parseFloat(hisab.price), 0);

  // Create PDF document
  const docsPath = RNFS.DownloadDirectoryPath;
  const pdfPath = `${docsPath}/Hisab_${personName}_${new Date().toISOString().split('T')[0]}.pdf`;
  
  const PDFDocument = PDFLib.PDFDocument;
  const pdfDoc = await PDFDocument.create();

  // Add a page
  const page = pdfDoc.addPage([550, 750]);

  // Draw content
  page.drawText(`Hisab Report for ${personName}`, {
    x: 50,
    y: 700,
    size: 20,
  });

  page.drawText(`From: ${startDate} To: ${endDate}`, {
    x: 50,
    y: 670,
    size: 12,
  });

  // Table headers
  page.drawText('Date', { x: 50, y: 640, size: 12 });
  page.drawText('Item', { x: 150, y: 640, size: 12 });
  page.drawText('Amount', { x: 400, y: 640, size: 12 });

  // Table rows
  let yPos = 620;
  filteredHisabs.forEach((hisab, index) => {
    page.drawText(hisab.date.split('T')[0], { x: 50, y: yPos, size: 10 });
    page.drawText(hisab.item, { x: 150, y: yPos, size: 10 });
    page.drawText(`₹${hisab.price}`, { x: 400, y: yPos, size: 10 });
    yPos -= 20;
    
    // Add description if exists
    if (hisab.description) {
      page.drawText(`- ${hisab.description}`, { x: 150, y: yPos, size: 8 });
      yPos -= 15;
    }
  });

  // Total
  page.drawText('Total:', { x: 350, y: yPos - 20, size: 12 });
  page.drawText(`₹${total.toFixed(2)}`, { x: 400, y: yPos - 20, size: 12 });

  // Save PDF
  const pdfBytes = await pdfDoc.save();
  await RNFS.writeFile(pdfPath, pdfBytes, 'base64');

  return pdfPath;
};