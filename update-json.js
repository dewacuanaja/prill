const fs = require('fs');
const axios = require('axios');

const filePath = './test.json'; // Path ke file JSON lokal
const repoOwner = 'dewacuanaja'; // Ganti dengan username GitHub Anda
const repoName = 'prill'; // Ganti dengan nama repositori Anda
const filePathInRepo = 'test.json'; // Path file JSON di repo GitHub
const branch = 'main'; // Pastikan branch sesuai dengan repo Anda

const GITHUB_TOKEN = process.env.GH_TOKEN; // Ambil token dari environment

if (!GITHUB_TOKEN) {
  console.error("Error: GH_TOKEN tidak ditemukan. Pastikan telah menambahkan Secrets GH_TOKEN di GitHub.");
  process.exit(1);
}

// Fungsi untuk membaca SHA dari file JSON yang ada di GitHub
async function getFileSHA() {
  try {
    const response = await axios.get(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePathInRepo}`, {
      headers: { Authorization: `token ${GITHUB_TOKEN}` }
    });
    return response.data.sha;
  } catch (error) {
    console.error('Gagal mendapatkan SHA dari file JSON:', error.response ? error.response.data : error.message);
    return null;
  }
}

// Fungsi untuk memperbarui file JSON di GitHub
async function updateJsonFile() {
  const sha = await getFileSHA();
  if (!sha) {
    console.error("Error: SHA file tidak ditemukan. Pastikan file JSON sudah ada di repo.");
    return;
  }

  const fileContent = fs.readFileSync(filePath, 'utf8');
  const encodedContent = Buffer.from(fileContent).toString('base64');

  try {
    const response = await axios.put(
      `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePathInRepo}`,
      {
        message: "Update JSON file with new product data",
        content: encodedContent,
        sha: sha,
        branch: branch
      },
      {
        headers: { Authorization: `token ${GITHUB_TOKEN}` }
      }
    );

    console.log('File JSON berhasil diperbarui:', response.data.commit.html_url);
  } catch (error) {
    console.error('Error saat memperbarui file JSON:', error.response ? error.response.data : error.message);
  }
}

// Jalankan fungsi update JSON
updateJsonFile();
