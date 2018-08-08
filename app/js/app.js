angular.module('auditoriaApp', [
	'ngSanitize', 
	'ngTouch',
	'ngAnimate',
	'ui.router', 
	'ui.bootstrap',
	'ui.select',
	'ui.grid',
	'ui.grid.edit',
	'ui.grid.resizeColumns',
	'ui.grid.exporter',
	'ui.grid.selection',
	'ui.grid.cellNav',
	'ui.grid.autoResize',
	'ui.grid.pinning',
	'ui.grid.expandable',
	'ui.grid.moveColumns',
	'toastr',
	'ui.utils.masks'
])

.config(function($stateProvider, $urlRouterProvider, uiSelectConfig, toastrConfig){
	
	
	uiSelectConfig.theme = 'select2'
	uiSelectConfig.resetSearchInput = true
	
	angular.extend(toastrConfig, {
	    maxOpened: 3,    
	    preventDuplicates: true,
	});


	$stateProvider

	.state('panel', {
		url: '/panel',
		controller: 'PanelCtrl',
		templateUrl: 'templates/panel.html',
		resolve: {
			USER: ['AuthServ', function(AuthServ){
				return AuthServ.verificar_user_logueado();
			}]
		}
	})

	.state('login', {
		url: '/login',
		controller: 'LoginCtrl',
		templateUrl: 'templates/login.html'
	})

	.state('panel.entidades', {
		url: '/entidades',
		controller: 'EntidadesCtrl',
		templateUrl: 'templates/entidades.html'
	})

	.state('panel.usuarios', {
		url: '/usuarios',
		controller: 'usuariosctrl',
		templateUrl: 'templates/usuarios.html'
	})

	.state('panel.auditorias', {
		url: '/auditorias',
		controller: 'auditoriasctrl',
		templateUrl: 'templates/auditorias.html'
	})



	.state('panel.preguntas', {
		url: '/preguntas',
		controller: 'preguntasctrl',
		templateUrl: 'templates/preguntas.html'
	})

	.state('panel.respuestas', {
		url: '/respuestas',
		controller: 'respuestasctrl',
		templateUrl: 'templates/respuestas.html'
	})

	.state('panel.informe', {
		url: '/informe',
		controller: 'informectrl',
		templateUrl: 'templates/informes.html'
	})

	.state('panel.informe.uniones', {
		url: '/uniones',
		controller: 'informesUnionesCtrl',
		templateUrl: 'templates/informes/todas-uniones.html'
	})


	.state('panel.informe.asociaciones', {
		url: '/Asociaciones',
		controller: 'informesAsociacionesCtrl',
		templateUrl: 'templates/informes/todas-asociaciones.html'
	})

	.state('panel.informe.distritos', {
		url: '/Distritos',
		controller: 'informesDistritosCtrl',
		templateUrl: 'templates/informes/todos-distritos.html'
	})

	.state('panel.informe.iglesias', {
		url: '/Iglesias',
		controller: 'informesiglesiasCtrl',
		templateUrl: 'templates/informes/todos-iglesias.html'
	})



	.state('panel.libromes', {
		url: '/libromes',
		controller: 'libroMesCtrl',
		templateUrl: 'templates/libroMes.html'
	})


	$urlRouterProvider.otherwise('/panel');

})