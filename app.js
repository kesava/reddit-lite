require(['libs/text!header.html', 'libs/text!home.html', 'libs/text!footer.html'], function (headerTpl, homeTpl, footerTpl) {
	
	var ApplicationRouter = Backbone.Router.extend({
		routes: {
			"": "home",
			"*actions": "home"
		},
		initialize: function() {
			this.headerView = new HeaderView();
			this.headerView.render();
			this.footerView = new FooterView();
			this.footerView.render();
		},
		home: function() {
			this.homeView = new HomeView();
			this.homeView.render();
		}
	});

	HeaderView = Backbone.View.extend({
		el: "#header",
		templateFileName: "header.html",
		template: headerTpl,

		initialize: function() {
			// $.get(this.templateFileName, function(data){console.log(data);this.template=data});		
		},
		render: function() {
			// console.log(this.template)
			$(this.el).html(_.template(this.template));
		}
	});

	FooterView = Backbone.View.extend({
		el: "#footer",
		template: footerTpl,
		render: function() {
			this.$el.html(_.template(this.template));
		}
	})
	HomeView = Backbone.View.extend({
		el: "#content",
		// template: "home.html",
		template: homeTpl,
		events: {
			"click #send": "saveMessage"
		},
		messageBoard: null,
		
		// collection: Messages,
		initialize: function() {
			Parse.initialize("Zc36GIp6WyzKIB9HvqRBEGnIeMO0X21rDbVwGPvp", "r5zTZ9eydAcnRhAUI6k3XazS1JSnOPLbiaT1cWY6");
			MessageBoard = Parse.Object.extend("MessageBoard");
			this.messageBoard = new MessageBoard();
			console.log("init mb");
			this.getMessages();
		},
		getMessages: function(){
			if (this.messageBoard) {
				console.log(this.messageBoard);
			}
			else {
				console.log("messageBoard is not set");
			}
		},
		saveMessage: function(){
			var newMessageForm=$("#new-message");
			var username=newMessageForm.find('[name="username"]').attr('value');
			var message=newMessageForm.find('[name="message"]').attr('value');
			this.messageBoard.save({
				"username": username,
				"message": message
				},{
				success: function(e) {
					console.log('saved');
				},
				error: function(e) {
					console.log('error');
				}
			});
		},
		render: function() {
			$(this.el).html(_.template(this.template));
		}
	});
	// Messages = Backbone.ParseCollection.extend({
	// 	url: "/data/messages"
	// });
	// Message = Backbone.ParseModel.extend({
	// 	urlRoot: "/data/messages"
	// });

	app = new ApplicationRouter();
	Backbone.history.start();	
});


