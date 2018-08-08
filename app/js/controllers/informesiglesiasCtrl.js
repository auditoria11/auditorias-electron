angular.module('auditoriaApp')

.controller('informesiglesiasCtrl', function($scope, ConexionServ){

    	$scope.consulta_igle = "SELECT i.rowid, i.nombre, i.alias, i.codigo,  i.distrito_id, i.zona,  i.tesorero_id,  i.secretario_id, " +
          "t.nombres as tesorero_nombres, t.apellidos as tesorero_apellidos, dis.nombre as nombre_distrito, s.nombres as secretario_nombres, s.nombres as secretario_apellidos " +
        "from iglesias i " +
         "INNER JOIN distritos dis ON i.distrito_id = dis.rowid " +
        "LEFT JOIN usuarios t ON t.tipo='Tesorero' and t.rowid=i.tesorero_id "+
        "LEFT JOIN usuarios s ON s.tipo='Secretario' and s.rowid=i.secretario_id ";       

    ConexionServ.query($scope.consulta_igle, []).then(function(result) {
      $scope.iglesias = result;
      console.log(result)
    }, function(tx) {
      console.log("Error no es posbile traer Iglesias", tx);
    });
    
});