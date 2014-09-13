/**
 * find the circular reference in cell dependency tree
 * @param  {string} address     the cell address that need to be checked
 * @return {bool}               true if circular reference found, false if not found
 */
cell.prototype.checkCircularReference = function(address){
    //console.log('cell[#'+this.sheet.elementId+'!'+this.address+'] : checking circular reference');
    var a, isCircular = false;

    if(typeof(address) == 'undefined'){
        address = this.getAddress();
    }

    if(false !== this.formula){
        /** first, check if the dependencies is redudant */
        for(a in this.dependencies){
            isCircular = isCircular || (a == address);

            //console.log(prefix+'cell: '+this.getAddress()+', dependencies: '+a+', is circular: '+isCircular);
            if(isCircular){
                return true;
            }
        }

        /** second, check if the dependencies of the dependency is redudant */
        for(a in this.dependencies){
            //console.log(prefix+'cell: '+this.getAddress()+', dependencies of dependency: '+a+', is circular: '+isCircular);

            isCircular = isCircular || this.dependencies[a].checkCircularReference(address);
            if(isCircular){
                return true;
            }
        }
    }

    return isCircular;
};