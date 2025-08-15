// Utility script: dumps execution path & node path to help debug ENOENT issues.
console.log('Node executable:', process.execPath);
console.log('Platform:', process.platform, 'Arch:', process.arch);
console.log('PATH entries:');
(process.env.PATH || '').split(process.platform === 'win32' ? ';' : ':').forEach(p => console.log('  -', p));
