require(['libs/text!header.html', 'libs/text!home.html', 'libs/text!footer.html'], function (headerTpl, homeTpl, footerTpl) {
	Parse.initialize("BST7uGEZOLUSkrD0DzwoyZaMBlwo7SLGlQrKEWUZ", "czAdRHLd6l9jwSgdTacvHXaDCYu66ulHf1vF8u1q");
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
		},
		render: function() {
			$(this.el).html(_.template(this.template));
		}
	});

	FooterView = Backbone.View.extend({
		el: "#footer",
		template: footerTpl,
		render: function() {
			this.$el.html(_.template(this.template));
		}
	});
	Message = Parse.Object.extend({
		className: "MessageBoard"
	})
	MessageBoard = Parse.Collection.extend ({
		model: Message
	});
	
	HomeView = Backbone.View.extend({
		el: "#content",
		template: homeTpl,
		events: {
			"click #send": "saveMessage",
			"click .upvote": "upVoteIdea",
			"click .downvote": "downVoteIdea"
		},

		initialize: function() {
			this.collection = new MessageBoard();
			this.collection.bind("all", this.render, this);
			this.collection.fetch();
			this.collection.on("add", function(message) {
				message.save(null, {
					success: function(message) {
						console.log('saved '+message);
					},
					error: function(message) {
						console.log('error');
					}
				});
				console.log('saved'+message);
			})
		},
		saveMessage: function(){
			var newMessageForm=$("#new-message");
			var username=newMessageForm.find('[name="username"]').attr('value');
			var message=newMessageForm.find('[name="message"]').attr('value');
			var votes = newMessageForm.find('[name="votes"]').attr('value') || 1;
			var upvotes = newMessageForm.find('[name="upvotes"]').attr('value') || 1;
			var downvotes = newMessageForm.find('[name="downvotes"]').attr('value') || 0;

			this.collection.add({
				"username": username,
				"message": message,
				"votes": votes,
				"upvotes": upvotes,
				"downvotes": downvotes
				});
		},
		upVoteIdea: function(e) {
			e.preventDefault();
			var id = $(e.currentTarget).data("id");
			console.log("Up Vote this Idea");
			idea = this.collection.getByCid(id);
			idea.attributes.votes = idea.attributes.votes + 1;
			idea.attributes.upvotes = idea.attributes.upvotes + 1
			idea.save(idea.attributes);

		},
		downVoteIdea: function(e) {
			e.preventDefault();
			var id = $(e.currentTarget).data("id");
			console.log("Down Vote this Idea");
			idea = this.collection.getByCid(id);
			idea.attributes.votes = idea.attributes.votes - 1;
			idea.attributes.downvotes = idea.attributes.downvotes - 1;
			idea.save(idea.attributes);
		},
		render: function() {
			console.log(this.collection)
			$(this.el).html(_.template(this.template, this.collection));
		}
	});

	app = new ApplicationRouter();
	Backbone.history.start();	
});


