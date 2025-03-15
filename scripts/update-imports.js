const fs = require('fs');
const path = require('path');

// Function to recursively find all TypeScript and JavaScript files
function findFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !filePath.includes('node_modules') && !filePath.includes('.git')) {
      fileList = findFiles(filePath, fileList);
    } else if (
      stat.isFile() && 
      (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js') || file.endsWith('.jsx'))
    ) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Function to update imports in a file
function updateImports(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let updated = false;
  
  // Update relative imports to use path aliases
  const importRegex = /import\s+(.+?)\s+from\s+['"](\.\.\/)+(components|hooks|constants|utils|layouts|types|assets|features)\/(.+?)['"]/g;
  const updatedContent = content.replace(importRegex, (match, imports, _, folder, path) => {
    updated = true;
    return `import ${imports} from '@${folder}/${path}'`;
  });
  
  if (updated) {
    fs.writeFileSync(filePath, updatedContent, 'utf8');
    console.log(`Updated imports in: ${filePath}`);
  }
}

// Main function
function main() {
  const srcDir = path.join(__dirname, '..', 'src');
  const files = findFiles(srcDir);
  
  console.log(`Found ${files.length} files to process`);
  
  files.forEach(file => {
    updateImports(file);
  });
  
  console.log('Import update complete!');
}

main(); 