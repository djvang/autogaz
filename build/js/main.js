$(document).ready(function(){
	var outer = $('#outer');
	var html = $('html');

	// header fixed variables
	var headerFixed = $('.header-fixed');
	var headerOffset = headerFixed.offset();

	// infoblock
	$('.ii-close').click(function() {
		$('.important-info').hide();
		headerOffset = headerFixed.offset();
	});

	// header fixed on scroll
	if (!outer.hasClass('checkout-page')) {
		$(window).scroll(function(){
			var top = $(this).scrollTop();
			top >= headerOffset.top ? headerFixed.addClass('fixed') : headerFixed.removeClass('fixed');
		});
	};

	// accordion
	var accordions = function(){
		var acc = document.getElementsByClassName("accordion");
		var i;

		for (i = 0; i < acc.length; i++) {
			acc[i].addEventListener("click", function() {
				this.classList.toggle("active");
				var panel = this.nextElementSibling;
				if (panel.style.maxHeight){
					panel.style.maxHeight = null;
				} else {
					panel.style.maxHeight = panel.scrollHeight + "px";
				}
			});
		}
	};
	accordions();

	// dropdown
	var dropdowns = function(){
		var dropdownBtn = $('.dropdown__btn');

		dropdownBtn.click(function() {
			var dropdown = $(this).parent('.dropdown');
			dropdown.toggleClass('show');

			$(document).click(function(e) {
				if (!dropdownBtn.is(e.target) && dropdownBtn.has(e.target).length === 0) {
					if (dropdown.hasClass('show')) {
						dropdown.removeClass('show')
					}
				}
			});
		});
	};
	dropdowns();

	// drilldown catalog touch devices
	var drilldownOptions = {
		event: 'click',
		selector: 'span.drilldown-item',
		speed: 200,
		cssClass: {
			container: 'drilldown-container',
			root: 'drilldown-root',
			sub: 'drilldown-sub',
			back: 'drilldown-back'
		}
	};
	$('.drilldown').drilldown(drilldownOptions);

	// fancybox
	$("[data-fancybox]").each(function() {
		var src = $(this).attr('data-src');
		var el = $(src);


		$(this).fancybox({
			autoFocus: false,
			touch: false,
			beforeShow: function(){
				outer.addClass('blurred');
				html.addClass('modal-active');
				if (el.hasClass('modal-bg-white')) {
					$('.fancybox-bg').addClass('bg-white')
				}
			},
			afterShow: function(){
				if (el.hasClass('search-mob')) {
					el.find('input').focus();
				}
			},
			beforeClose: function(){
				outer.removeClass('blurred');
				html.removeClass('modal-active');
				if (el.hasClass('modal-bg-white')) {
					$('.fancybox-bg').removeClass('bg-white')
				}
			}
		});
	});

	// fancybox gallery
	$('[data-fancybox^="gallery"]').fancybox({
		arrows: true,
		autoFocus: false,
		touch: false,
		beforeShow: function(){
			outer.addClass('blurred');
			html.addClass('modal-active');
		},
		beforeClose: function(){
			outer.removeClass('blurred');
			html.removeClass('modal-active');
		}
	});

	// tabs
	var tabs = function() {
		var tab = $('.tabs-list').children('li');
		tab.click(function(){
			var tabContent = $(this).parent('.tabs-list').siblings('.tab-content');
			$(this).siblings('li').removeClass('active');
			$(this).addClass('active');
			tabContent.removeClass('current');
			$("#" + $(this).attr('data-tab')).addClass('current');
		});
	}
	tabs();

	// scroll gradient
	var scrollgradient = function() {
		var sgrad = $('.grad');

		sgrad.each(function() {
			var sgradItemsWidth = 0;
			var sgradHolder = $(this).parent();
			var sgradItems = $(this).children();
			var sgradWidth = $(this).width();

			if ($(this).hasClass('breadcrumbs')) {
				sgradItems.find('li').each(function() {
					sgradItemsWidth = sgradItemsWidth + $(this).outerWidth();
				})
			} else {
				sgradItems.each(function() {
					sgradItemsWidth = sgradItemsWidth + $(this).outerWidth();
					return sgradItemsWidth;
				});
			}

			sgradItemsWidth = Math.round(sgradItemsWidth);

			if (sgradItemsWidth > sgradWidth) {
				sgradHolder.addClass('js-grad js-grad-right');

				$(this).on('scroll', function() {
					var sleft = $(this).scrollLeft();
					var sdifference = Math.round(sgradWidth + sleft);

					if (sleft > 0) {
						sgradHolder.addClass('js-grad-left');
						if (sdifference > sgradWidth) {
							sgradHolder.addClass('js-grad-right');
							if(sdifference >= sgradItemsWidth && sgradHolder.hasClass('js-grad-right')) {
								sgradHolder.removeClass('js-grad-right')
							}
						}
					}
					else if(sgradHolder.hasClass('js-grad-left')) {
						sgradHolder.removeClass('js-grad-left')
					}
				});
			};
		});
	};
	scrollgradient();

	// tel mask
	jQuery(function() {
		$('.tel-mask').mask('+38 (999) 999-99-99');
	});

	// password field switch
	var switches = $('.switch-type');
	switches.each(function() {
		var field = $(this).parent(".field-box").find('input');
		$(this).on('click', function() {
			if (field.attr("type") === "password") {
				field.attr("type", "text");
				$(this).addClass('js-light')
			} else {
				field.attr("type", "password");
				if ($(this).hasClass('js-light')) {
					$(this).removeClass('js-light')
				}
			}
		});
	});

	// star rating
	var stars = $('.star-rating__ico');
	stars.each(function() {
		$(this).click(function() {
			var starTitle = $(this).attr('title');
			$(this).parent('.star-rating__wrap').siblings('.star-rating__text').html(starTitle);
		});
	});

	// form validation

	// add methods custom telephone validator with maskeidInput
	$.validator.addMethod("minlenghtphone", function (value, element) {
		return value.replace(/\D+/g, '').length > 11;
	}, "Недостаточно символов");
	$.validator.addMethod("requiredphone", function (value, element) {
		return value.replace(/\D+/g, '').length > 1;
	}, "Заполните поле корректно");

	// password check
	$.validator.addMethod("pwcheck", function(value) {
		return /^[A-Za-z0-9\d=!\-@._*]*$/.test(value) // consists of only these
			&& /[a-z]/.test(value) // has a lowercase letter
			&& /\d/.test(value) // has a digit
	});

	// form-pass-recovery validation
	$('.form-pass-recovery').validate({
		rules: {
			tel: {
				requiredphone: true,
				minlenghtphone: true,
			},
		},
		messages: {
			tel: {
				requiredphone: 'Заполните поле корректно',
				minlenghtphone: 'Недостаточно символов',
			},
		},
		highlight: function(element) {
			$(element).parent('.field-box').addClass('field-box--error').removeClass('field-box--valid');
		},
		unhighlight: function(element) {
			$(element).parent('.field-box').addClass('field-box--valid').removeClass('field-box--error');
		},
		errorPlacement: function(error, element) {
			$(element).siblings('.error-element').attr("title", error.text());
		},
		submitHandler: function(form) {            
			$.ajax({
				url: '',
				type: 'POST',
				dataType: 'json',
				success: function(data){
					//
				}
			});
		}
	});

	// form-sign-in validation
	$('.form-sign-in').validate({
		rules: {
			tel: {
				requiredphone: true,
				minlenghtphone: true,
			},
			password: {
				required: true,
			},
		},
		messages: {
			tel: {
				requiredphone: 'Заполните поле корректно',
				minlenghtphone: 'Недостаточно символов',
			},
			password: {
				required: 'Заполните поле корректно',
			},
		},
		highlight: function(element) {
			$(element).parent('.field-box').addClass('field-box--error').removeClass('field-box--valid');
		},
		unhighlight: function(element) {
			$(element).parent('.field-box').addClass('field-box--valid').removeClass('field-box--error');
		},
		errorPlacement: function(error, element) {
			$(element).siblings('.error-element').attr("title", error.text());
		},
		submitHandler: function(form) {            
			$.ajax({
				url: '',
				type: 'POST',
				dataType: 'json',
				success: function(data){
					//
				}
			});
		}
	});

	// form-registration validation
	$('.form-registration').validate({
		rules: {
			name: {
				required: true,
				minlength: 2,
			},
			tel: {
				requiredphone: true,
				minlenghtphone: true,
			},
			password: {
				required: true,
				minlength: 6,
				pwcheck: true,
			},
			email: {
				required: true,
				email: true,
			},
		},
		messages: {
			name: {
				required: 'Заполните поле корректно',
				minlength: 'Длина должна быть не меньше 2-х символов',
			},
			tel: {
				requiredphone: 'Заполните поле корректно',
				minlenghtphone: 'Недостаточно символов',
			},
			password: {
				required: 'Заполните поле корректно',
				minlength: 'Недостаточно символов',
			},
			email: {
				required: 'Заполните поле корректно',
				email: 'Email введен некорректно',
			}
		},
		highlight: function(element) {
			$(element).parent('.field-box').addClass('field-box--error').removeClass('field-box--valid');
		},
		unhighlight: function(element) {
			$(element).parent('.field-box').addClass('field-box--valid').removeClass('field-box--error');
		},
		errorPlacement: function(error, element) {
			$(element).siblings('.error-element').attr("title", error.text());
		},
		submitHandler: function(form) {            
			$.ajax({
				url: '',
				type: 'POST',
				dataType: 'json',
				success: function(data){
					//
				}
			});
		}
	});

	// form-personal-data
	$('.form-personal-data').validate({
		rules: {
			name: {
				required: true,
				minlength: 2,
			},
			surname: {
				required: true,
				minlength: 2,
			},
			email: {
				required: true,
				email: true,
			},
			birthday: {
				maxlength: 2,
				max: 31,
			},
			birthyear: {
				maxlength: 4,
				min: 1900,
			},
		},
		messages: {
			name: {
				required: 'Заполните поле корректно',
				minlength: 'Длина должна быть не меньше 2-х символов',
			},
			surname: {
				required: 'Заполните поле корректно',
				minlength: 'Длина должна быть не меньше 2-х символов',
			},
			email: {
				required: 'Заполните поле корректно',
				email: 'Email введен некорректно',
			},
		},
		highlight: function(element) {
			$(element).parent('.field-box').addClass('field-box--error').removeClass('field-box--valid');
		},
		unhighlight: function(element) {
			$(element).parent('.field-box').addClass('field-box--valid').removeClass('field-box--error');
		},
		errorPlacement: function(error, element) {
			$(element).siblings('.error-element').attr("title", error.text());
		},
		submitHandler: function(form) {            
			$.ajax({
				url: '',
				type: 'POST',
				dataType: 'json',
				success: function(data){
					//
				}
			});
		}
	});

	// form-change-pass validation
	$('.form-change-pass').validate({
		rules: {
			passwordcurrent: {
				required: true,
				minlength: 6,
			},
			passwordnew: {
				required: true,
				minlength: 6,
				pwcheck: true,
			},
			passwordconfirm: {
				required: true,
				minlength: 6,
				equalTo : "#pass-new",
			},
		},
		messages: {
			passwordcurrent: {
				required: 'Заполните поле корректно',
				minlength: 'Недостаточно символов',
			},
			passwordnew: {
				required: 'Заполните поле корректно',
				minlength: 'Недостаточно символов',
			},
			passwordconfirm: {
				required: 'Заполните поле корректно',
				minlength: 'Недостаточно символов',
				equalTo: 'Повторите новый пароль',
			},
		},
		highlight: function(element) {
			$(element).parent('.field-box').addClass('field-box--error').removeClass('field-box--valid');
		},
		unhighlight: function(element) {
			$(element).parent('.field-box').addClass('field-box--valid').removeClass('field-box--error');
		},
		errorPlacement: function(error, element) {
			$(element).siblings('.error-element').attr("title", error.text());
		},
		submitHandler: function(form) {            
			$.ajax({
				url: '',
				type: 'POST',
				dataType: 'json',
				success: function(data){
					//
				}
			});
		}
	});

	// form-callback validation
	$('.form-callback').validate({
		rules: {
			name: {
				required: true,
				minlength: 2,
			},
			tel: {
				requiredphone: true,
				minlenghtphone: true,
			},
		},
		messages: {
			name: {
				required: 'Заполните поле корректно',
				minlength: 'Длина должна быть не меньше 2-х символов',
			},
			tel: {
				requiredphone: 'Заполните поле корректно',
				minlenghtphone: 'Недостаточно символов',
			},
		},
		highlight: function(element) {
			$(element).parent('.field-box').addClass('field-box--error').removeClass('field-box--valid');
		},
		unhighlight: function(element) {
			$(element).parent('.field-box').addClass('field-box--valid').removeClass('field-box--error');
		},
		errorPlacement: function(error, element) {
			$(element).siblings('.error-element').attr("title", error.text());
		},
		submitHandler: function(form) {            
			$.ajax({
				url: '',
				type: 'POST',
				dataType: 'json',
				success: function(data){
					//
				}
			});
		}
	});

	// form-feedback validation
	$('.form-feedback').validate({
		rules: {
			message: {
				required: true,
				minlength: 20,
			},
			name: {
				required: true,
				minlength: 2,
			},
			email: {
				required: true,
				email: true,
			},
		},
		messages: {
			message: {
				required: 'Заполните поле корректно',
				minlength: 'Длина должна быть не меньше 20-ти символов',
			},
			name: {
				required: 'Заполните поле корректно',
				minlength: 'Длина должна быть не меньше 2-х символов',
			},
			email: {
				required: 'Заполните поле корректно',
				email: 'Email введен некорректно',
			},
		},
		highlight: function(element) {
			$(element).parent('.field-box').addClass('field-box--error').removeClass('field-box--valid');
		},
		unhighlight: function(element) {
			$(element).parent('.field-box').addClass('field-box--valid').removeClass('field-box--error');
		},
		errorPlacement: function(error, element) {
			$(element).siblings('.error-element').attr("title", error.text());
		},
		submitHandler: function(form) {            
			$.ajax({
				url: '',
				type: 'POST',
				dataType: 'json',
				success: function(data){
					//
				}
			});
		}
	});

	// form-issue validation
	$('.form-issue').validate({
		rules: {
			number: {
				required: true,
				minlength: 2,
			},
			message: {
				required: true,
				minlength: 20,
			},
			name: {
				required: true,
				minlength: 2,
			},
			email: {
				required: true,
				email: true,
			},
		},
		messages: {
			number: {
				required: 'Заполните поле корректно',
				minlength: 'Длина должна быть не меньше 2-х символов',
			},
			message: {
				required: 'Заполните поле корректно',
				minlength: 'Длина должна быть не меньше 20-ти символов',
			},
			name: {
				required: 'Заполните поле корректно',
				minlength: 'Длина должна быть не меньше 2-х символов',
			},
			email: {
				required: 'Заполните поле корректно',
				email: 'Email введен некорректно',
			},
		},
		highlight: function(element) {
			$(element).parent('.field-box').addClass('field-box--error').removeClass('field-box--valid');
		},
		unhighlight: function(element) {
			$(element).parent('.field-box').addClass('field-box--valid').removeClass('field-box--error');
		},
		errorPlacement: function(error, element) {
			$(element).siblings('.error-element').attr("title", error.text());
		},
		submitHandler: function(form) {            
			$.ajax({
				url: '',
				type: 'POST',
				dataType: 'json',
				success: function(data){
					//
				}
			});
		}
	});

	// form-question validation
	$('.form-question').each(function() {
		$(this).validate({
			rules: {
				question: {
					required: true,
					minlength: 10,
				},
				name: {
					required: true,
					minlength: 2,
				},
				email: {
					required: true,
					email: true,
				},
			},
			messages: {
				question: {
					required: 'Заполните поле корректно',
					minlength: 'Длина должна быть не меньше 10-ти символов',
				},
				name: {
					required: 'Заполните поле корректно',
					minlength: 'Длина должна быть не меньше 2-х символов',
				},
				email: {
					required: 'Заполните поле корректно',
					email: 'Email введен некорректно',
				},
			},
			highlight: function(element) {
				$(element).parent('.field-box').addClass('field-box--error').removeClass('field-box--valid');
			},
			unhighlight: function(element) {
				$(element).parent('.field-box').addClass('field-box--valid').removeClass('field-box--error');
			},
			errorPlacement: function(error, element) {
				$(element).siblings('.error-element').attr("title", error.text());
			},
			submitHandler: function(form) {            
				$.ajax({
					url: '',
					type: 'POST',
					dataType: 'json',
					success: function(data){
						//
					}
				});
			}
		});
	});

	// form-evaluation validation
	$('.form-evaluation').validate({
		rules: {
			advantages: {
				required: true,
				minlength: 2,
			},
			disadvantages: {
				required: true,
				minlength: 2,
			},
			comment: {
				required: true,
				minlength: 2,
			},
			name: {
				required: true,
				minlength: 2,
			},
			email: {
				required: true,
				email: true,
			},
		},
		messages: {
			advantages: {
				required: 'Заполните поле корректно',
				minlength: 'Длина должна быть не меньше 2-х символов',
			},
			disadvantages: {
				required: 'Заполните поле корректно',
				minlength: 'Длина должна быть не меньше 2-х символов',
			},
			comment: {
				required: 'Заполните поле корректно',
				minlength: 'Длина должна быть не меньше 2-х символов',
			},
			name: {
				required: 'Заполните поле корректно',
				minlength: 'Длина должна быть не меньше 2-х символов',
			},
			email: {
				required: 'Заполните поле корректно',
				email: 'Email введен некорректно',
			},
		},
		highlight: function(element) {
			$(element).parent('.field-box').addClass('field-box--error').removeClass('field-box--valid');
		},
		unhighlight: function(element) {
			$(element).parent('.field-box').addClass('field-box--valid').removeClass('field-box--error');
		},
		errorPlacement: function(error, element) {
			$(element).siblings('.error-element').attr("title", error.text());
		},
		submitHandler: function(form) {            
			$.ajax({
				url: '',
				type: 'POST',
				dataType: 'json',
				success: function(data){
					//
				}
			});
		}
	});


	$('[data-hover]').on('mouseenter mouseleave', function(e) {

		var target = $(this).data('hover');

		var elements = $('[data-hover="'+ target +'"]');

		if(e.type === 'mouseenter') {
			elements.addClass('is-hover');
		} else {
			elements.removeClass('is-hover');
		}

	});


	$('[data-close]').on('click', function(e) {
		var target = $(this).data('close');

		$(target).addClass('is-closed');

	})

});
