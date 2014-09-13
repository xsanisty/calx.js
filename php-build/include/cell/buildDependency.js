/**
 * build inter-cell dependency and dependant list, used for triggerring calculation that related to other cell
 * @return {void}
 */
cell.prototype.buildDependency = function(){
    var pattern = {
            remoteCellRange : /\#[A-Za-z0-9_]+\s*!\s*[A-Za-z]+[0-9]+\s*:\s*[A-Za-z]+[0-9]+/g,
            remoteCell      : /\#[A-Za-z0-9_]+\s*!\s*[A-Za-z]+[0-9]+/g,
            cellRange       : /[A-Za-z]+[0-9]+\s*:\s*[A-Za-z]+[0-9]+/g,
            cell            : /[A-Z]+[0-9]+/g
        },
        formula     = this.formula,
        sheetKey    = '#'+this.sheet.el.attr('id'),
        cellAddress = this.address,
        dependencies,
        a, i, j, key,
        formulaPart,
        cellStart,
        cellStop,
        cellPart,
        cellObject,
        cellMatch,
        sheetId;

    /** clear up the dependant and dependency reference */
    for(a in this.dependencies){
        /** if not remote cell */
        if(a.indexOf('#') === -1){
            this.dependencies[a].removeDependant(cellAddress);
        }else{
            this.dependencies[a].removeDependant(sheetKey+'!'+cellAddress);
        }

        delete this.dependencies[a];
    }

    if(formula){
        /**
         * searching for cells in formula
         */
        for(a in pattern){
            cellMatch   = formula.match(pattern[a]);
            formula     = formula.replace(pattern[a], '');

            if(null !== cellMatch){
                switch(a){
                    case "remoteCellRange":
                        for(i = 0; i < cellMatch.length; i++){
                            formulaPart = cellMatch[i].split('!');
                            sheetId     = $.trim(formulaPart[0]);
                            cellPart    = formulaPart[1].split(':');
                            cellStart   = $.trim(cellPart[0]);
                            cellStop    = $.trim(cellPart[1]);

                            dependencies = this.sheet.getRemoteCellRange(sheetId, cellStart, cellStop);
                            for(j in dependencies){
                                key = sheetId+'!'+j;
                                if(typeof(this.dependencies[key]) == 'undefined' && false !== dependencies[j]){
                                    this.dependencies[key] = dependencies[j];
                                    dependencies[j].registerDependant(sheetKey+'!'+this.getAddress(), this);
                                }
                            }
                        }
                        break;

                    case "remoteCell":
                        for(i = 0; i < cellMatch.length; i++){
                            formulaPart = cellMatch[i].split('!');
                            sheetId     = $.trim(formulaPart[0]);
                            cellPart    = $.trim(formulaPart[1]);

                            dependencies = this.sheet.getRemoteCell(sheetId, cellPart);
                            key = sheetId+'!'+cellPart;
                            if(typeof(this.dependencies[key]) == 'undefined' && false !== dependencies){
                                this.dependencies[key] = dependencies;
                                dependencies.registerDependant(sheetKey+'!'+this.getAddress(), this);

                            }
                        }
                        break;

                    case "cellRange":
                        for(i = 0; i < cellMatch.length; i++){
                            cellPart    = cellMatch[i].split(':');
                            cellStart   = $.trim(cellPart[0]);
                            cellStop    = $.trim(cellPart[1]);

                            dependencies = this.sheet.getCellRange(cellStart, cellStop);
                            for(j in dependencies){
                                if(typeof(this.dependencies[j]) == 'undefined' && false !== dependencies[j]){
                                    this.dependencies[j] = dependencies[j];
                                    dependencies[j].registerDependant(this.getAddress(), this);

                                }
                            }
                        }
                        break;

                    case "cell":
                        for(i = 0; i < cellMatch.length; i++){
                            cellPart    = cellMatch[i];

                            dependencies = this.sheet.getCell(cellPart);
                            if(typeof(this.dependencies[cellPart]) == 'undefined' && false !== dependencies){
                                this.dependencies[cellPart] = dependencies;
                                dependencies.registerDependant(this.getAddress(), this);

                            }
                        }
                        break;
                }
            }
        }
    }

    var dlist = [];
    for(a in this.dependencies){
        dlist.push(a);
    }
    console.log('cell['+this.address+'] :  Building dependency list '+dlist);
};