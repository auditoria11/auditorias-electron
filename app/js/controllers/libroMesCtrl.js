angular.module("auditoriaApp")

.controller("libroMesCtrl", function($scope, ConexionServ, $filter, $uibModal, toastr, AuthServ, $timeout, 	$location, $anchorScroll ) {

	
	$scope.entidades 				= true;
	$scope.widget_maximized 		= false;
	$scope.widget_maximized_totales = false;
	
    $scope.distrito_new 	= {};
	$scope.modentidades 	= false;
	$scope.verCrearDistrito = false;
	$scope.usuarios 		= [];
	$scope.verCrearLibroMensual = false;
	$scope.vercomends = false;
	
	$scope.meses = [
		{num: 0, mes: 'Enero'},
		{num: 1, mes: 'Febrero'},
		{num: 3, mes: 'Marzo'},
		{num: 4, mes: 'Abril'},
		{num: 5, mes: 'Mayo'},
		{num: 6, mes: 'Junio'},
		{num: 7, mes: 'Julio'},
		{num: 8, mes: 'Agosto'},
		{num: 9, mes: 'Septiembre'},
		{num: 10, mes: 'Octubre'},
		{num: 11, mes: 'Noviembre'},
		{num: 12, mes: 'Diciembre'}
	];

	$scope.years = [
		{year: 2017},
		{year: 2018},
		{year: 2019},
		{year: 2020},
		{year: 2021},
		{year: 2022},
		{year: 2023},
		{year: 2024},
		{year: 2025},
		{year: 2026},
		{year: 2027},
		{year: 2028},
		{year: 2029},
		{year: 2030}
	];
	
	$scope.gridOptions = {
		enableSorting: true,
		enableFiltering: true,
		columnDefs: [
			{ field: 'nombre' },
			{ field: 'alias' },
			{ field: 'celular' },
			{ field: 'tesorero_nombres' }
		],
		onRegisterApi: function( gridApi ) {
			$scope.grid1Api = gridApi;
		}
	};
	


    $scope.funcvercomend = function() {
    	if ($scope.vercomends == true) {
    		$scope.vercomends = false;
    	}else{
    		$scope.vercomends = true;
    	}


		$scope.traerrecos();

		$timeout(function() {
			$location.hash("nueva_new_new_union");
			$anchorScroll();
		}, 100);
    };

	$scope.abrirLibroSemanal = function(libro_mes) {


	    var modalInstance = $uibModal.open({
	        templateUrl: 'templates/libros/libroSemanalModal.html',
	        resolve: {
		        libro_mes: function () {
		        	return libro_mes;
		        }
		    },
	        controller: 'LibroSemanalModalCtrl' // En LibroMesModales.js 
	    });

	    modalInstance.result.then(function (result) {
			console.log(result);
			for (let i = 0; i < $scope.lib_meses.length; i++) {
				const element = $scope.lib_meses[i];
				
				if (result.rowid == element.rowid) {
					$scope.lib_meses.slice(i, 1, element);
				}
			}
	    }, function(r2){
	    	$scope.traerDatos();
	    });


	}



	$scope.abrirGastos = function(libro_mes) {

	    var modalInstance = $uibModal.open({
	        templateUrl: 'templates/libros/gastosMesModal.html',
	        resolve: {
		        libro_mes: function () {
		        	return libro_mes;
		        }
		    },
	        controller: 'GastosMesCtrl' // En LibroMesModales.js 
	    });

	    modalInstance.result.then(function (result) {
			console.log(result);
			for (let i = 0; i < $scope.lib_meses.length; i++) {
				const element = $scope.lib_meses[i];
				
				if (result.rowid == element.rowid) {
					$scope.lib_meses.slice(i, 1, element);
				}
			}
	    }, function(r2){
	    	$scope.traerDatos();
	    });


	}



	$scope.cambiaValor = function(libro, columna) {

		consulta 	= 'UPDATE lib_mensuales SET ' + columna + '=?, modificado=1 WHERE rowid=?';
		colum 		= columna.charAt(0).toUpperCase() + columna.slice(1);
		
		ConexionServ.query(consulta, [libro[columna], libro.rowid]).then(function(){
			toastr.success(colum + ' guardado');
		}, function(){
			toastr.error(colum + ' NO guardado');
		});

	}



	$scope.crear_libronuevo = function(libro_new) {
		$scope.creando_libro = true;
		
  		if (libro_new.mes.length > 1) {
			  toastr.warning('Solo puedes seleccionar un mes.');
			  $scope.creando_libro = false;
  			return;
  		}
  		if (libro_new.year == undefined) {
			  toastr.warning('Seleccione el año.');
			  $scope.creando_libro = false;
  			return;
  		}
  		if (libro_new.year.length > 1) {
			toastr.warning('Solo puedes seleccionar un año.');
			$scope.creando_libro = false;
  			return;
  		}

  	

  		year_temp 	= libro_new.year[0];
  		mes_temp 	= libro_new.mes[0];


		consulta 	= 'INSERT INTO lib_mensuales(year, mes, auditoria_id, diezmos, ofrendas, especiales, remesa_enviada, modificado) VALUES(?,?,?,?,?,?,?,?)';
		
		datos = [year_temp, mes_temp, $scope.USER.auditoria_id,0,0,0,0,'1'];

		console.log(consulta, datos);

		ConexionServ.query(consulta, datos).then(function(result) {

			consulta 	= 'INSERT INTO lib_semanales(libro_mes_id) VALUES(?)';
			ConexionServ.query(consulta, [result.insertId]).then(function(result) {
				$scope.traerDatos();
			});
			
			// Movemos al siguiente mes
			if (mes_temp=='Enero') {libro_new.mes[0] = 'Febrero'}else if(mes_temp=='Febrero'){libro_new.mes[0] = 'Marzo'}else if(mes_temp=='Marzo'){libro_new.mes[0] = 'Abril'}else if(mes_temp=='Abril'){libro_new.mes[0] = 'Mayo'}else if(mes_temp=='Mayo'){libro_new.mes[0] = 'Junio'}else if(mes_temp=='Junio'){libro_new.mes[0] = 'Julio'}
			  else if(mes_temp=='Julio'){libro_new.mes[0] = 'Agosto'}else if(mes_temp=='Agosto'){libro_new.mes[0] = 'Septiembre'}else if(mes_temp=='Septiembre'){libro_new.mes[0] = 'Octubre'}else if(mes_temp=='Octubre'){libro_new.mes[0] = 'Noviembre'}else if(mes_temp=='Noviembre'){libro_new.mes[0] = 'Diciembre'}
			  else if(mes_temp=='Diciembre'){
					libro_new.year[0] 	= '' + (parseInt(libro_new.year[0]) + 1);
					console.log(libro_new.year[0]);
				  	libro_new.mes[0] 	= 'Enero';
				};
			
			$scope.creando_libro = false;

		}, function(tx) {
			console.log("Error no es posbile crear mes", tx);
			$scope.creando_libro = false;
		});
	};
    $scope.cancelar_crear_distrito = function() {
		$scope.distrito_new 	= {};
		$scope.verCrearDistrito = false;
	};
	
	

	$scope.traerDatos = function(){
		AuthServ.update_user_storage($scope.USER).then((actualizado)=>{
			console.log(actualizado);
			$scope.USER 		= actualizado;
			$scope.lib_meses 	= [];

			consulta 	= 'SELECT m.*, m.rowid, s.*, s.rowid as lib_semanal_id FROM lib_mensuales m ' + 
						'INNER JOIN lib_semanales s ON m.rowid=s.libro_mes_id and m.eliminado is null';
			
			ConexionServ.query(consulta, []).then(function(result) {
				$scope.lib_meses = result;
				
				angular.forEach($scope.lib_meses, function(lib_mes, indice){
					$scope.gastosLibMes(lib_mes);
				})

			}, function(tx) {
				console.log("Error no se pudo traer datos", tx);
			});

		})
		
	}
	
	$scope.traerDatos();
	
	
	$scope.gastosLibMes = function (lib_mes) {
		consulta 	= 'SELECT g.*, g.rowid FROM gastos_mes g WHERE g.libro_mes_id=?';
		
		ConexionServ.query(consulta, [lib_mes.rowid]).then(function(result) {
			lib_mes.gastos_detalle = result;
		}, function(tx) {
			console.log("Error trayendo gastos de mes, ", lib_mes, tx);
		});
	}


	$scope.traerrecos = function () {
		consulta 	= 'SELECT tr.*, tr.rowid FROM recomendaciones tr WHERE tr.id=?';
		
		ConexionServ.query(consulta, [$scope.USER.auditoria_id]).then(function(result) {

			for (var i = result.length - 1; i >= 0; i--) {

				if (result[i].superada == 0) {
					result[i].superada = "no"
				}else{result[i].superada = "sí"}
				
			}

			
			console.log(result);
	
			$scope.Recomendaciones = result;
		}, function(tx) {
			console.log("Error trayendo recomendaciones, ", trec, tx);
		});
	}



   	$scope.EliminarLibroMensul = function(lib_mens){
	  	
	  	var res = confirm("¿Seguro que desea eliminar?");

		if (res == true) {

		 	consulta ="UPDATE lib_mensuales SET eliminado=1 WHERE rowid=? ";

			ConexionServ.query(consulta,[lib_mens.rowid]).then(function(result){

				console.log('Libro mes eliminido', result);
				$scope.lib_meses = $filter('filter') ($scope.lib_meses, {rowid: '!' + lib_mens.rowid})
				toastr.success('Mes eliminado.');

			} , function(tx){
				console.log('Libro mes no se pudo Eliminar' , tx)
			});
		}
	}
	 

	$scope.cambiaSaldoAnterior = function(usu) {

		consulta 	= 'UPDATE auditorias SET saldo_ant=?, modificado=1 WHERE rowid=?';
        
		ConexionServ.query(consulta, [usu.saldo_ant, usu.iglesia_audit_id]).then(function(){
			toastr.success('Saldo guardado');
		}, function(){
			toastr.error('Saldo NO guardado');
		});

	}
	
	$scope.total_ingresos_periodo = ()=>{
		
		if ($scope.lib_meses) {
			suma = 0;
			for (let i = 0; i < $scope.lib_meses.length; i++) {
				const mes = $scope.lib_meses[i];
				suma = suma + (mes.especiales + mes.ofrendas * 0.6);
			}
			$scope.total_disponible_periodo = $filter('currency')((suma + $scope.USER.saldo_ant), '$', 0);
			return $filter('currency')(suma, '$', 0);
		}else{
			$scope.total_disponible_periodo = 0;
			return 0;
		}
		
	}
	
	
	
});
