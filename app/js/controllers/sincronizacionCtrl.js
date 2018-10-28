

angular.module("auditoriaApp")

.controller("sincronizacionCtrl", function($scope, ConexionServ, $filter, toastr, $location, $anchorScroll, $timeout, $uibModal,  $http, rutaServidor) {
	$scope.entidades = true;
    $scope.distrito_new = {};
    $scope.modentidades = false;
    $scope.verCrearDistrito = false;
	$scope.usuarios = [];
	
	$scope.tpl_igle = {
		nombre: '',
		distrito_id: null,
		zona: null,
		tipo: 'IGLESIA',
		
		tipo_propiedad: '',
		anombre_propiedad: '',
		fecha_propiedad: null,
		fecha_fin: null,
	}
	
	$scope.tpl_distr = {
		nombre: '',
		zona: null,
		codigo: null
	}
	
	$scope.iglesia_new 	= angular.copy($scope.tpl_igle);
	$scope.distrito_new = angular.copy($scope.tpl_distr);
	
	$scope.ver_uniones 		= false;
	$scope.ver_asociaciones = false;
	$scope.ver_distritos 	= false;
	$scope.ver_iglesias 	= false;
	
	$scope.toggleUniones = ()=>{
		$scope.ver_uniones = !$scope.ver_uniones;
	}
	$scope.toggleAsociaciones = ()=>{
		$scope.ver_asociaciones = !$scope.ver_asociaciones;
	}
	$scope.toggleDistritos = ()=>{
		$scope.ver_distritos = !$scope.ver_distritos;
	}
	$scope.toggleIglesias = ()=>{
		$scope.ver_iglesias = !$scope.ver_iglesias;
	}
	

    btGrid1 ='<a uib-tooltip="Editar" ng-show="row.entity.modificado" tooltip-placement="left" tooltip-append-to-body="true" class="btn btn-default btn-xs icon-only" ng-click="grid.appScope.subir_datos({iglesias: [row.entity]} )"><i class="glyphicon glyphicon-pencil "></i></a>';
    btGrid2 ='<a uib-tooltip=" Eliminar" ng-show="row.entity.eliminado" tooltip-placement="right" tooltip-append-to-body="true" class="btn btn-danger btn-xs icon-only" ng-click="grid.appScope.subir_datos({iglesias: [row.entity]} )"><i class="glyphicon glyphicon-remove  "></i></a>';
    bt2 ='<span style="padding-left: 2px; padding-top: 4px;" class="btn-group">' + btGrid1 +btGrid2 +"</span>";

    $scope.gridOptions = {
      showGridFooter: true,
      enableSorting: true,
      enableFiltering: true,
      enebleGridColumnMenu: false,
      enableCellEdit: false,
      columnDefs: [
        {
          name: "no", displayName: "No", width: 45, enableCellEdit: false, enableColumnMenu: false,
          cellTemplate: '<div class="ui-grid-cell-contents">{{grid.renderContainers.body.visibleRowCache.indexOf(row)+1}}</div>'
				},
				{ field: "rowid", displayName: "Id", pinnedLeft: true, width: 40, enableCellEdit: false },
        { name: "edicion", displayName: "Edición", width: 60, enableSorting: false, enableFiltering: false, cellTemplate: bt2, enableCellEdit: false, enableColumnMenu: true },
        { field: "nombre", minWidth:150 },
        { field: "alias", minWidth: 90 },
        { field: "codigo", minWidth: 90 },
        { field: "tipo", minWidth: 90 },
        { field: "zona", minWidth: 80 }
      ],
      onRegisterApi: function(gridApi) {
        $scope.grid1Api = gridApi;
        gridApi.edit.on.afterCellEdit($scope, function(rowEntity,colDef,newValue,oldValue) {
			if (newValue != oldValue) {
				if (colDef.field === "tipo") {
					newValue = newValue.toUpperCase();
					if (!(newValue === "IGLESIA" || newValue === "GRUPO")) {
						toastr.warning("Debe usar IGLESIA o GRUPO");
						rowEntity.tipo = oldValue;
						return;
					}
				}
				ConexionServ.query("UPDATE iglesias SET "+colDef.field+"='"+newValue+"' WHERE rowid=?", [ rowEntity.rowid ] ).then(function(r) {
					return toastr.success("Iglesia actualizada con éxito");
				}, function(r2) {
					rowEntity[colDef.field] = oldValue;
					return toastr.error("Cambio no guardado", "Error");
				});
			}
        });
        $timeout(function() {
          $scope.$apply();
        }, 0);
      }
    };

	

    $scope.subir_datos = function (elemento){
    	
    	datos = {};

    	if (elemento) {
			datos = elemento;
    	}else{
    		datos = {
    			iglesias: 			$scope.iglesias,
    			distritos: 			scope.distritos,
    			asociaciones: 		$scope.asociaciones,
    			iglesias: $scope.iglesias,
    			iglesias: $scope.iglesias
    		};
    	}

		$http.put(rutaServidor.ruta + '/subir-datos', datos).then (function(result){

			for (var i = 0; i < auditorias.length; i++) {
			 	auditorias[i] 

			 
				consulta = 'INSERT INTO auditorias (rowid, id, fecha, saldo_ant, iglesia_id) VALUES(?, ?, ?, ?, ?)'
					ConexionServ.query(consulta, [auditorias[i].id, auditorias[i].id, auditorias[i].fecha, auditorias[i].saldo_ant, auditorias[i].iglesia_id]).then(function(result){
						console.log('se cargo auditorias', result);
					
					}, function(tx){
						console.log('error', tx);
					});
			 }
			 toastr.success();
		}, function(){
			toastr.error('No se pudo subir datos');
		})
	}



    $scope.descargar_datos = function (elemento){
    	
		$http.get(rutaServidor.ruta + '/all').then (function(result){
			auditorias = result.data.auditorias;
			iglesias = result.data.iglesias;
			uniones = result.data.uniones;
			distritos = result.data.distritos;

			for (var i = 0; i < auditorias.length; i++) {
			 	auditorias[i] 

			 
				consulta = 'INSERT INTO auditorias (rowid, id, fecha, saldo_ant, iglesia_id) VALUES(?, ?, ?, ?, ?)'
					ConexionServ.query(consulta, [auditorias[i].id, auditorias[i].id, auditorias[i].fecha, auditorias[i].saldo_ant, auditorias[i].iglesia_id]).then(function(result){
						console.log('se cargo auditorias', result);
					
					}, function(tx){
						console.log('error', tx);
					});
			 }

			for (var i = 0; i < distritos.length; i++) {

			 
				consulta = 'INSERT INTO distritos (rowid, id, nombre, alias, codigo, pastor_id) VALUES(?, ?, ?, ?, ?, ?)'
					ConexionServ.query(consulta, [distritos[i].id, distritos[i].id, distritos[i].nombre, distritos[i].alias, distritos[i].codigo, distritos[i].pastor_id]).then(function(result){
						console.log('se cargo distritos', result);
					
					}, function(tx){
						console.log('error', tx);
					});
			 } 
			for (var i = 0; i < iglesias.length; i++) {

			 
				consulta = 'INSERT INTO iglesias (id, nombre, alias, codigo, distrito_id) VALUES(?, ?, ?, ?, ?)'
				ConexionServ.query(consulta, [iglesias[i].id, iglesias[i].nombre, iglesias[i].alias, iglesias[i].codigo, iglesias[i].distrito_id]).then(function(result){
					console.log('se cargo el iglesias', result);
	
					}, function(tx){
						console.log('error', tx);
					});
			 } 
			
			for (var i = 0; i < uniones.length; i++) {

				consulta = 'INSERT INTO uniones (id, nombre, alias, codigo) VALUES(?, ?, ?, ?)'
				ConexionServ.query(consulta, [uniones[i].id, uniones[i].nombre, uniones[i].alias, uniones[i].codigo]).then(function(result){
					console.log('se guardo la carrera papi', result);
					
				}, function(tx){
					console.log('error', tx);
				});
			} 



		}), function(){
			console.log('error db')
		}

	}


    // Traemos todos los datos que necesito para trabajar
    $scope.traerDatos = function() {
			// Traemos USUARIOS
			consulta = "SELECT rowid, nombres, apellidos, sexo, tipo, celular, username from usuarios";

			ConexionServ.query(consulta, []).then(function(result) {
				$scope.usuarios = result;
			},function(tx) {
				console.log("Error no es posbile traer usuarios", tx);
			});

			// Traemos IGLESIAS
			/*
			$scope.consulta_igle =
				"SELECT i.rowid, i.nombre, i.alias, i.distrito_id, i.zona, d.nombre as distrito_nombre, i.tesorero_id, i.secretario_id, " +
					"t.nombres as tesorero_nombres, t.apellidos as tesorero_apellidos, i.tipo, " + 
					"i.tipo_propiedad, i.anombre_propiedad, i.fecha_propiedad, i.fecha_fin, " + 
					"i.tipo_propiedad2, i.anombre_propiedad2, i.fecha_propiedad2, i.fecha_fin2, " + 
					"i.tipo_propiedad3, i.anombre_propiedad3, i.fecha_propiedad3, i.fecha_fin3 " + 
				"FROM iglesias i " +
				"LEFT JOIN distritos d ON d.rowid=i.distrito_id " +
				"LEFT JOIN usuarios t ON t.tipo='Tesorero' and t.rowid=i.tesorero_id where i.modificado= '1'  or eliminado=1 ";
			*/

			$scope.consulta_igle =
				"SELECT i.rowid, i.nombre, i.alias, i.distrito_id, i.zona, i.tesorero_id, i.modificado, i.eliminado " +
				"FROM iglesias i " +
				"where i.modificado= '1'  or eliminado=1 ";


				

			ConexionServ.query($scope.consulta_igle, []).then(function(result) {
				$scope.iglesias = result;
				$scope.gridOptions.data = result;
			}, function(tx) {
				console.log("Error no es posbile traer iglesias", tx);
			});

			// Traemos DISTRITOS
			consulta = "SELECT d.rowid, d.*, p.nombres as pastor_nombres, p.apellidos as pastor_apellidos, " +
					"p.nombres as pastor_nombres, p.apellidos as pastor_apellidos, " +
					"t.nombres as tesorero_nombres, t.apellidos as tesorero_apellidos " +
				"FROM distritos d " +
				"LEFT JOIN usuarios t ON t.tipo='Tesorero' and t.rowid=d.tesorero_id " +
				"LEFT JOIN usuarios p ON p.tipo='Pastor' and p.rowid=d.pastor_id ";

			consulta = "SELECT d.rowid, d.* from distritos d WHERE d.modificado=1 or eliminado=1 or id is null " ;

			ConexionServ.query(consulta, []).then(function(result) {
				$scope.distritos = result;
			}, function(tx) {
				console.log("Error no es posbile traer distritos", tx);
			});

			// Traemos Uniones
			consulta = "SELECT rowid, nombre, alias, codigo, division_id from uniones un WHERE un.modificado=1 or eliminado=1 or id is null";

			ConexionServ.query(consulta, []).then(function(result) {
				$scope.uniones = result;
			}, function(tx) {
				console.log("Error no es posbile traer Uniones", tx);
			});

			// Traemos Asociaciones
			consulta = "SELECT aso.rowid, aso.*  from asociaciones aso WHERE aso.modificado=1 or eliminado=1 or id is null ";

			ConexionServ.query(consulta, []).then(function(result) {
				$scope.asociaciones = result;
			}, function(tx) {
				console.log("Error no es posbile traer asociaciones", tx);
			});
    };

	$scope.traerDatos();    
	
  

	
	
})





.controller('RemoveIglesiaCtrl', ['$scope', '$uibModalInstance', 'elemento', 'toastr', 'ConexionServ', ($scope, $modalInstance, elemento, toastr, ConexionServ)=>{
	$scope.elemento = elemento;
	console.log('elemento', elemento);

	$scope.ok = ()=>{

		
		consulta = "DELETE FROM iglesias WHERE rowid=? ";

		ConexionServ.query(consulta, [elemento.rowid]).then(function(result) {
			console.log("Iglesia eliminada", elemento);
			$modalInstance.close(elemento)
		}, function(tx) {
			console.log("iglesia no se pudo Eliminar", tx);
			$modalInstance.dismiss('Error')
		})
		
	}
	
	$scope.cancel = ()=>{
		$modalInstance.dismiss('cancel')
	}

}])
