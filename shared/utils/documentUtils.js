import { saveAs } from "file-saver";
import JSZip from "jszip";
import { formatDate } from "./formatUtils.js";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const getDocumentLinks = (documentIds, documents) => {
  return documentIds
    .map((docId) => {
      const doc = documents?.find((d) => d.id === docId);
      return doc ? `${BASE_URL}/uploads/${doc.path}` : null;
    })
    .filter(Boolean);
};

export const downloadFiles = async (document, documentIds, documents) => {
  const links = getDocumentLinks(documentIds, documents);
  if (links.length === 0) return;

  if (links.length === 1) {
    try {
      const response = await fetch(links[0]);
      const blob = await response.blob();
      const filename = links[0].split("/").pop() || "document";
      saveAs(blob, filename);
    } catch (error) {
      console.error(`Erreur lors du téléchargement du fichier:`, error);
    }
  } else {
    const zip = new JSZip();
    try {
      const downloadPromises = links.map(async (link) => {
        try {
          const response = await fetch(link);
          const blob = await response.blob();
          const filename = link.split("/").pop() || "fichier_inconnu";
          zip.file(filename, blob);
        } catch (error) {
          console.error(`Erreur lors du téléchargement de ${link}:`, error);
        }
      });

      await Promise.all(downloadPromises);

      zip.generateAsync({ type: "blob" }).then((zipBlob) => {
        const zipFilename = `${formatDate(document.date)} - ${
          document.name || "Documents"
        }.zip`;

        if (zipBlob) {
          saveAs(zipBlob, zipFilename);
        }
      });
    } catch (error) {
      console.error("Erreur lors de la génération du fichier ZIP:", error);
    }
  }
};

export const sendMail = async (document, documentIds, documents) => {
  await downloadFiles(document, documentIds, documents);
  const mailUrl = `https://mail.google.com/mail/?view=cm&fs=1`;
  window.open(mailUrl);
};
