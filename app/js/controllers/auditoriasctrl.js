angular.module('auditoriaApp')

.controller('auditoriasctrl' , function($scope, ConexionServ, $filter, AuthServ){

	$scope.vercrearauditorias = function(){

		$scope.vermostrandocrarauditorias = !$scope.vermostrandocrarauditorias

		
	}

 

   $scope.veractuauditoria = function(auditoria){


   	$scope.modusers = !$scope.modusers

   	 
		
		$scope.auditoria_editars = auditoria;
	}

	ConexionServ.createTables();


	 $scope.InsertEntidadAuditoria = function(auditoria_crear){

	 	fecha_fix = new Date(auditoria_crear.fecha);
		fecha_fix = '' + auditoria_crear.fecha.getFullYear() + '/' + auditoria_crear.fecha.getMonth() + '/' + auditoria_crear.fecha.getDate() ;

		hora_fix = new Date(auditoria_crear.hora);
		hora_fix = '' + auditoria_crear.hora.getHours() + ':' + auditoria_crear.hora.getMinutes() + ':' + auditoria_crear.hora.getSeconds() ;
	  	


	 	consulta ="INSERT INTO auditorias(fecha, hora, iglesia_id) VALUES(?, ?, ?) "
	   ConexionServ.query(consulta,[fecha_fix, hora_fix, auditoria_crear.iglesia.rowid]).then(function(result){

           console.log('Auditoria creada', result);
           $scope.verMostrarAuditoriasTabla();
           alert('Auditoria creada exitosamente')

	   } , function(tx){

	   	console.log('Auditoria no se pudo crear' , tx)

	   });


	 } 

	 $scope.verMostrarAuditoriasTabla = function(){


	   ConexionServ.query('SELECT  a.*, a.rowid, i.nombre, i.alias  from auditorias a INNER JOIN iglesias i ON a.iglesia_id = i.rowid  ', []).then(function(result){
	          $scope.auditorias = result;
		} , function(tx){
		   	console.log('Error no es posbile traer auditorias' , tx)
		})




	    ConexionServ.query('SELECT i.*, i.rowid, d.nombre as nombre_distrito, d.alias as alias_distrito from iglesias i INNER JOIN distritos d ON d.rowid=i.distrito_id', []).then(function(result){

			$scope.iglesias = result;

		} , function(tx){

	   		console.log('Error no es posbile traer Entidades' , tx)

		});
	 



	 } 



  
	 $scope.verMostrarAuditoriasTabla();


	$scope.agruparPorDistrito = function (item){
        return item.nombre_distrito;
    };
	


	 $scope.actusersauditoria = function(auditoria_cambiar){


	 	auditoria_cambiar.fecha = new Date();
		auditoria_cambiar.fecha = ' ' + auditoria_cambiar.fecha.getFullYear() + ' / ' + auditoria_cambiar.fecha.getMonth() + ' / ' + auditoria_cambiar.fecha.getDate() ;

		auditoria_cambiar.hora = new Date();
		auditoria_cambiar.hora = ' ' + auditoria_cambiar.hora.getHours() + ' : ' + auditoria_cambiar.hora.getMinutes() + ' : ' + auditoria_cambiar.hora.getSeconds() ;
	  	
	 consulta ="UPDATE  auditorias SET fecha=?, hora=?, entidad=? WHERE rowid=? "
	   ConexionServ.query(consulta,[auditoria_cambiar.fecha, auditoria_cambiar.hora, auditoria_cambiar.entidad,  auditoria_cambiar.rowid]).then(function(result){

           console.log('auditoria  Actualizado', result)
           alert('auditoria actualizado correctamente presione F5 para recargar')

	   } , function(tx){

	   	console.log('auditoria no se pudo actualizar' , tx)

	   });

	 } 




	 $scope.elimninaradutiroiar = function(auditoria){
	  	
	 	consulta ="DELETE FROM auditorias WHERE rowid=? ";

	   ConexionServ.query(consulta,[auditoria.rowid]).then(function(result){


           console.log('auditoria eliminido', result);
           $scope.auditorias = $filter('filter') ($scope.auditorias, {rowid: '!' + auditoria.rowid})
	   } , function(tx){

	   	console.log('auditoria no se pudo Eliminar' , tx)

	   });

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


