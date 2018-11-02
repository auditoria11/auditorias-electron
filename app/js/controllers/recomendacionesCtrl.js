angular.module('auditoriaApp')

.controller('recomendacionesCtrl' , function($scope, ConexionServ, $filter, AuthServ, toastr){
	
	$scope.reco_crear = {
		superada: 0
	};
	$scope.vermostrarreco = true;
	$scope.recomendaciones = [];
	
	
	consulta = 'SELECT 	rec.* from recomendaciones rec '
		
		
	ConexionServ.query(consulta, []).then(function(result){
		$scope.recomendaciones = result;
	} , function(tx){
			console.log('Error no es posbile traer Recomendaciones' , tx)
	});
	 
	
	$scope.vercrearrecomendacion = function(){
		$scope.vermostrarreco = !$scope.vermostrarreco
	}


	$scope.verActuAuditoria = function(auditoria){
		
		if (auditoria.fecha && auditoria.hora) {
			text = auditoria.fecha + ' ' + auditoria.hora;
			console.log(text);
			auditoria.hora_new = new Date(text);
			console.log(auditoria.hora_new);
		}
		
		if (auditoria.fecha) {
			auditoria.fecha = new Date(auditoria.fecha);
		}
		
		for (let i = 0; i < $scope.iglesias.length; i++) {
			const igl = $scope.iglesias[i];
			if (igl.rowid == auditoria.iglesia_id) {
				auditoria.iglesia = igl;
			}
		}
   		$scope.modusers 			= !$scope.modusers;
		$scope.auditoria_editars 	= auditoria;
	}

	$scope.insertarrecomendacion = function(reco){
		

	 	consulta ="INSERT INTO recomendaciones(fecha, justificacion, superada, recomendacion, modificado) VALUES(?,?,?,?,?) "
		ConexionServ.query(consulta,[reco.fecha, reco.justificacion , reco.superada, reco.recomendacion, '1']).then(function(result){

			console.log('recomendacion creada', result);
			$scope.verMostrarAuditoriasTabla();
			toastr.success('recomendacion creada exitosamente')

		} , function(tx){
			console.log('recomendacion no se pudo crear' , tx)
		});
	} 

	$scope.verMostrarAuditoriasTabla = function(){

		ConexionServ.query('SELECT a.*, a.rowid, i.nombre, i.alias from auditorias a INNER JOIN iglesias i ON a.iglesia_id = i.rowid  ', []).then(function(result){
	        $scope.auditorias = result;
		} , function(tx){
		   	console.log('Error no es posbile traer auditorias' , tx)
		})
		

	} 




	$scope.agruparPorDistrito = function (item){
        return item.nombre_distrito;
    };
	


	$scope.actusersauditoria = function(auditoria_cambiar){


	 	auditoria_cambiar.fecha = new Date();
		auditoria_cambiar.fecha = ' ' + auditoria_cambiar.fecha.getFullYear() + ' / ' + auditoria_cambiar.fecha.getMonth() + ' / ' + auditoria_cambiar.fecha.getDate() ;

		auditoria_cambiar.hora = new Date();
		auditoria_cambiar.hora = ' ' + auditoria_cambiar.hora.getHours() + ' : ' + auditoria_cambiar.hora.getMinutes() + ' : ' + auditoria_cambiar.hora.getSeconds() ;
	  	
	 	consulta ="UPDATE auditorias SET fecha=?, hora=?, entidad=?, saldo_ant=? WHERE rowid=? "
		ConexionServ.query(consulta,[auditoria_cambiar.fecha, auditoria_cambiar.hora, auditoria_cambiar.entidad, auditoria_cambiar.saldo_ant, auditoria_cambiar.rowid]).then(function(result){

           console.log('auditoria  Actualizado', result)
           alert('auditoria actualizado correctamente presione F5 para recargar')

		} , function(tx){
			console.log('auditoria no se pudo actualizar' , tx)
		});
	} 




	 $scope.eliminarreco = function(reco){
	  	
	 		var res = confirm("¿Seguro que desea eliminar ? ");

		if (res == true) {
			consulta = 'UPDATE  recomendaciones SET eliminado=? WHERE rowid=? ';
		ConexionServ.query(consulta, ['1', reco.rowid]).then( function(result) {
			console.log("recomendacion Eliminada", result);
			toastr.success("recomendacion Eliminada Exitosamente.");
		},function(tx) {
			toastr.info("La recomendacion que intenta eliminar no se pudo actualizar.");
		});
	}

	 } 


	$scope.seleccionarAuditoria = function(auditoria) {

		ConexionServ.query('UPDATE usuarios SET auditoria_id=? WHERE rowid=? ', [ auditoria.rowid, $scope.USER.rowid ]).then(function(result) {
			$scope.USER.auditoria_id 		= auditoria.rowid;

			AuthServ.update_user_storage($scope.USER).then(function(usuario){
				
			});
		});
	}



	$scope.InsertarMesAño = function(){
   
	};





});


