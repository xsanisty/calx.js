cell.fx.hasRemoteDependency = function(status){
    if(typeof(status) == 'undefined'){
        return this.remoteDependency
    }else{
        this.remoteDependency = status;
    }
};