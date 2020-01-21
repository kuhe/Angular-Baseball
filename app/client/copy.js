// copy files into deployment positions

// rm -rf ../../public/* &&
// cp -R ./baseball-angular/dist/* ../../public &&
// mv ../../public/index.html ../../index.html &&
// mv ../../public/public/* ../../public/

const path = require('path');
const fs = require('fs-extra');

const root = path.join(__dirname, '..', '..');

const _public = path.join(root, 'public');
const dist = path.join(root, 'app', 'client', 'baseball-angular', 'dist', 'angular-baseball');
const index = path.join(root, 'public', 'index.html');
const index2 = path.join(root, 'index.html');

const _publicPublic = path.join(root, 'public', 'public');

fs.removeSync(_public);
fs.ensureDirSync(_public);

fs.copySync(dist, _public);
fs.copySync(_publicPublic, _public, { overwrite: true });
fs.removeSync(_publicPublic);
fs.moveSync(index, index2, { overwrite: true });

fs.writeFileSync(
    index2,
    fs.readFileSync(index2, 'utf-8')
        .replace(/\/public/g, '/public/')
        .replace(/\/public\/\//g, '/public/')
);
