export const Pattern = {
    remoteColRange  : /\#[A-Za-z0-9_]+\s*!\s*[A-Za-z]+\s*:\s*[A-Za-z]+/g,
    remoteRowRange  : /\#[A-Za-z0-9_]+\s*!\s*[0-9]+\s*:\s*[0-9]+/g,
    remoteCellRange : /\#[A-Za-z0-9_]+\s*!\s*[A-Za-z]+[0-9]+\s*:\s*[A-Za-z]+[0-9]+/g,
    remoteCell      : /\#[A-Za-z0-9_]+\s*!\s*[A-Za-z]+[0-9]+/g,
    colRange        : /[A-Za-z]+\s*:\s*[A-Za-z]+/g,
    rowRange        : /[0-9]+\s*:\s*[0-9]+/g,
    cellRange       : /[A-Za-z]+[0-9]+\s*:\s*[A-Za-z]+[0-9]+/g,
    cell            : /[A-Z]+[0-9]+/g
};