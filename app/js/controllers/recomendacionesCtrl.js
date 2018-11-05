angular.module('auditoriaApp')

.controller('recomendacionesCtrl' , function($scope, ConexionServ, $filter, AuthServ, toastr, $location, $anchorScroll, $timeout, $uibModal){
	
	
   $scope.reco_crear = {};

	$scope.reco_crear = {
		superada: 0
	};
	
	$scope.recomendaciones = [];

	
	
	consulta = 'SELECT 	rec.*, rec.rowid from recomendaciones rec WHERE rec.eliminado !="1"'



		
		
	ConexionServ.query(consulta, []).then(function(result){
		$scope.recomendaciones = result;
	} , function(tx){
			console.log('Error no es posbile traer Recomendaciones' , tx)
	});
	 
	
	$scope.vercrearrecomendacion = function(){
		if (!$scope.USER.auditoria_id) {
			toastr.warning('Primero debe seleccionar una auditoria.');
			return;
		}
		$scope.vermostrarreco = true;
	};

	$scope.cancelarVerCrearReco = function(){
		$scope.vermostrarreco = false;
	};



	$scope.verDtosrecomendacion = function(){


		 consulta = "SELECT rowid, * from recomendaciones";



			ConexionServ.query(consulta, []).then(function(result) {

				for (var i = result.length - 1; i >= 0; i--) {

				if (result[i].superada == 0) {
					result[i].superada = "no"
				}else{result[i].superada = "sí"}
				
			}
			
				$scope.recomendaciones = result;
			},function(tx) {
				console.log("Error no es posbile traer recomendaciones", tx);
			});

	};



	$scope.insertarrecomendacion = function(reco){
		if (reco.fecha) {
			fecha_fix = window.fixDate(reco.fecha);
		}
		 
	    

	 	consulta ="INSERT INTO recomendaciones(fecha, auditoria_id, justificacion, superada, recomendacion, modificado) VALUES(?,?,?,?,?,?)  "
		ConexionServ.query(consulta,[reco.fecha, $scope.USER.auditoria_id, reco.justificacion , reco.superada, reco.recomendacion, '0']).then(function(result){

			console.log('recomendacion creada', result);
			$scope.verDtosrecomendacion();
			toastr.success('recomendacion creada exitosamente')


		} , function(tx){
			console.log('recomendacion no se pudo crear' , tx)
		});
	} 





      $scope.VerActualizarReco = function(reco){
      	if (!$scope.USER.auditoria_id) {
			toastr.warning('Primero debe seleccionar una auditoria.');
			return;
		}
      	$scope.VerCreandoReco = true;

		$scope.act_reco = reco;

		$timeout(function() {
			$location.hash("editar-recomendaciones");
			$anchorScroll();
		}, 100);



		if (reco.fecha ) {
			text = reco.fecha ;
			console.log(text);
			reco.hora_new = new Date(text);
			console.log(reco.hora);
		}
		
		if (reco.fecha) {
			reco.fecha = new Date(reco .fecha);
		}
		
			

      };

       $scope.closeActualizarReco = function(){
      	$scope.VerCreandoReco = false;

      };




	$scope.actureco = function(reco){


	 	consulta ="UPDATE recomendaciones SET fecha=?, justificacion=?, superada=?, recomendacion=?, modificado=? WHERE rowid=? "
		ConexionServ.query(consulta,[reco.fecha, reco.justificacion , reco.superada, reco.recomendacion, '1', reco.rowid]).then(function(result){

           console.log('recomendacion  Actualizada', result)
           alert('recomendacion actualizada correctamente presione F5 para recargar')

		} , function(tx){
			console.log('recomendacion no se pudo actualizar' , tx)
		});
	} 




	 $scope.eliminarreco = function(recomendacion){
	  	
	 		var res = confirm("¿Seguro que desea eliminar ? ");

		if (res == true) {
			console.log(recomendacion)
			consulta = 'UPDATE  recomendaciones SET eliminado=? WHERE rowid=? '
		ConexionServ.query(consulta, ['1', recomendacion.rowid]).then( function(result) {
			console.log("recomendacion Eliminada", result);
			toastr.success("recomendacion Eliminada Exitosamente.");
		},function(tx) {
			toastr.info("La recomendacion que intenta eliminar no se pudo actualizar.");
		});
	} else {

		
	}

	 } 








});


