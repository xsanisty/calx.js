/**
 * build inter-cell dependency and dependant list, used for triggerring calculation that related to other cell
 * @return {void}
 */
cell.fx.buildDependency = function(){
    var patterns = {
            remoteColumnRange   : /\#[A-Za-z0-9_]+\s*!\s*[A-Za-z]+\s*:\s*[A-Za-z]+/g,
            remoteRowRange      : /\#[A-Za-z0-9_]+\s*!\s*[0-9]+\s*:\s*[0-9]+/g,
            remoteCellRange     : /\#[A-Za-z0-9_]+\s*!\s*[A-Za-z]+[0-9]+\s*:\s*[A-Za-z]+[0-9]+/g,
            remoteCell          : /\#[A-Za-z0-9_]+\s*!\s*[A-Za-z]+[0-9]+/g,
            columnRange         : /[A-Za-z]+\s*:\s*[A-Za-z]+/g,
            rowRange            : /[0-9]+\s*:\s*[0-9]+/g,
            cellRange           : /[A-Za-z]+[0-9]+\s*:\s*[A-Za-z]+[0-9]+/g,
            cell                : /[A-Z]+[0-9]+/g
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
        sheetId,
        sheetIdentifier;

    /** clear up the dependant and dependency reference */
    for(a in this.dependencies){

        /** remove self from dependant registry in dependencies list before removing */
        if(a.indexOf('#') < 0){
            this.dependencies[a].removeDependant(cellAddress);
        }else{
            this.dependencies[a].removeDependant(sheetKey+'!'+cellAddress);
        }

        /** remove cell from dependencies list after removing itself from dependant registry */
        delete this.dependencies[a];
    }


    /** if formula exist, start scanning cell address inside the formula */
    if(formula){
        /** searching for cells in formula */
        for(a in patterns){
            cellMatch   = formula.match(patterns[a]);
            formula     = formula.replace(patterns[a], '');

            if(null !== cellMatch){
                switch(a){
                    /* First round, find the remote cell range and take it from formula */
                    case "remoteCellRange":
                        for(i = 0; i < cellMatch.length; i++){
                            formulaPart = cellMatch[i].split('!');
                            sheetId     = $.trim(formulaPart[0]);
                            cellPart    = formulaPart[1].split(':');
                            cellStart   = $.trim(cellPart[0]);
                            cellStop    = $.trim(cellPart[1]);

                            /** list all cells in range as dependencies */
                            dependencies = this.sheet.getRemoteCellRange(sheetId, cellStart, cellStop);

                            /** get the calx identifier of the remote sheet */
                            sheetIdentifier = $(sheetId).attr('data-calx-identifier');


                            /** if not identified yet, init calx on it and get the identifier */
                            if(typeof(sheetIdentifier) == 'undefined' || typeof(calx.sheetRegistry[sheetIdentifier]) == 'undefined'){
                                $(sheetId).calx();

                                sheetIdentifier = $(sheetId).attr('data-calx-identifier');
                            }

                            /** build dependency relationship to each sheet */
                            if(typeof(sheetIdentifier) !='undefined' && typeof(calx.sheetRegistry[sheetIdentifier]) != 'undefined'){
                                calx.sheetRegistry[sheetIdentifier].registerDependant(this.sheet);
                                this.sheet.registerDependency(calx.sheetRegistry[sheetIdentifier]);
                            }

                            /** build dependency relationship on current cell and it's dependencies */
                            for(j in dependencies){
                                key = sheetId+'!'+j;
                                if(typeof(this.dependencies[key]) == 'undefined' && false !== dependencies[j]){
                                    this.hasRemoteDependency(true);
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
                            sheetIdentifier = $(sheetId).attr('data-calx-identifier');

                            if(typeof(sheetIdentifier) == 'undefined' || typeof(calx.sheetRegistry[sheetIdentifier]) == 'undefined'){
                                $(sheetId).calx();
                            }

                            if(typeof(sheetIdentifier) !='undefined' && typeof(calx.sheetRegistry[sheetIdentifier]) != 'undefined'){
                                calx.sheetRegistry[sheetIdentifier].registerDependant(this.sheet);
                                this.sheet.registerDependency(calx.sheetRegistry[sheetIdentifier]);
                            }

                            key = sheetId+'!'+cellPart;
                            if(typeof(this.dependencies[key]) == 'undefined' && false !== dependencies){
                                this.hasRemoteDependency(true);
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

    return this;

    //var dlist = [];
    //for(a in this.dependencies){
    //    dlist.push(a);
    //}
    //console.log('cell[#'+this.sheet.elementId+'!'+this.address+'] :  Building dependency list '+dlist);
};