const fs = require('fs');
const axios = require('axios');

const filePath = './test.json';  // Path ke file JSON Anda
const repoOwner = 'dewacuanaja';  // Ganti dengan nama akun GitHub Anda
const repoName = 'prill';  // Ganti dengan nama repositori Anda
const filePathInRepo = 'test.json';  // Path file JSON di repositori

// Ambil SHA dari file JSON yang ada
axios.get(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePathInRepo}`)
  .then(response => {
    const sha = response.data.sha;

    // Baca file JSON lokal
    const fileContent = fs.readFileSync(filePath, 'utf8');

    // Kirim request untuk update file
    return axios.put(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePathInRepo}`, {
      message: "Update JSON file with new product data",
      content: Buffer.from(fileContent).toString('base64'),
      sha: sha  // Berikan SHA agar GitHub tahu file mana yang akan diupdate
    }, {
      headers: {
        Authorization: `token ${process.env.GITHUB_TOKEN}`
      }
    });
  })
  .then(response => {
    console.log('File JSON berhasil diperbarui');
  })
  .catch(error => {
    console.error('Error saat memperbarui file JSON:', error);
  });
