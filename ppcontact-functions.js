let notificationEmail = "lacintemel3@gmail.com";
let ownerWhatsApp = "905367179731";

$(document).ready(function(){
	
	// Randevu formu gönderme
	$(document).on('click', '#randevuSendForm', function () {
    	let form = $('#randevuForm');
    	
    	let firstname = form.find('input[name="firstname"]').val();
    	if (!firstname) {
    		form.find('input[name="firstname"]').css('border-color', 'red');
    		alert("İsim alanı boş bırakılamaz");
    		return false;
    	}
    	
    	let lastname = form.find('input[name="lastname"]').val();
    	if (!lastname) {
    		form.find('input[name="lastname"]').css('border-color', 'red');
    		alert("Soyadı alanı boş bırakılamaz");
    		return false;
    	}
    	
    	let email = form.find('input[name="email"]').val();
    	if (!email) {
    		form.find('input[name="email"]').css('border-color', 'red');
    		alert("Email alanı boş bırakılamaz");
    		return false;
    	}
    	
    	let phone = form.find('input[name="telephone"]').val();
    	if (!phone) {
    		form.find('input[name="telephone"]').css('border-color', 'red');
    		alert("Telefon alanı boş bırakılamaz");
    		return false;
    	}
    	
    	let project = form.find('input[name="project"]').val();
    	if (!project) {
    		form.find('input[name="project"]').css('border-color', 'red');
    		alert("Proje alanı boş bırakılamaz");
    		return false;
    	}
    	
    	let randevuSaati = form.find('select[name="randevu"]').val();
    	if (!randevuSaati) {
    		form.find('select[name="randevu"]').css('border-color', 'red');
    		alert("Randevu saati seçiniz");
    		return false;
    	}
    	
    	let randevuTarihi = form.find('input[name="randevu-tarihi"]').val();
    	if (!randevuTarihi) {
    		form.find('input[name="randevu-tarihi"]').css('border-color', 'red');
    		alert("Randevu tarihi seçiniz");
    		return false;
    	}
    	
    	let kvkkCheck = form.find('input[name="kvkk-check"]').prop("checked");
    	if (!kvkkCheck) {
    		alert("Lütfen KVKK metnini onaylayınız.");
    		return;
    	}
    	
    	let formData = {
    		type: 'randevu',
    		firstname: firstname,
    		lastname: lastname,
    		email: email,
    		phone: phone,
    		project: project,
    		randevuSaati: randevuSaati,
    		randevuTarihi: randevuTarihi
    	};
    	
    	SendFormData(formData, form);
    });

	// İletişim formu gönderme
    $(document).on('click', '#iletisimSendForm', function () {
        let form = $('#iletisimForm');
        
        let firstname = form.find('input[name="firstname"]').val();
        if (!firstname) {
        	form.find('input[name="firstname"]').css('border-color', 'red');
        	alert("İsim alanı boş bırakılamaz");
        	return false;
        }
        
        let lastname = form.find('input[name="lastname"]').val();
        if (!lastname) {
        	form.find('input[name="lastname"]').css('border-color', 'red');
        	alert("Soyadı alanı boş bırakılamaz");
        	return false;
        }
        
        let email = form.find('input[name="email"]').val();
        if (!email) {
        	form.find('input[name="email"]').css('border-color', 'red');
        	alert("Email alanı boş bırakılamaz");
        	return false;
        }
        
        let phone = form.find('input[name="telephone"]').val();
        if (!phone) {
        	form.find('input[name="telephone"]').css('border-color', 'red');
        	alert("Telefon alanı boş bırakılamaz");
        	return false;
        }
        
        let project = form.find('input[name="project"]').val();
        if (!project) {
        	form.find('input[name="project"]').css('border-color', 'red');
        	alert("Proje alanı boş bırakılamaz");
        	return false;
        }
        
        let message = form.find('input[name="message"]').val();
        if (!message) {
        	form.find('input[name="message"]').css('border-color', 'red');
        	alert("Mesaj alanı boş bırakılamaz");
        	return false;
        }
        
        let kvkkCheck = form.find('input[name="kvkk-check"]').prop("checked");
        if (!kvkkCheck) {
        	alert("Lütfen KVKK metnini onaylayınız.");
        	return;
        }
        
        let formData = {
        	type: 'iletisim',
        	firstname: firstname,
        	lastname: lastname,
        	email: email,
        	phone: phone,
        	project: project,
        	message: message
        };
        
        SendFormData(formData, form);
    });

});

function SendFormData(formData, activeForm) {
	$('.response-alert').remove();
	
	$.ajax({
		type: "POST",
		url: 'mail/send-notification.php',
		data: formData,
		dataType: 'json',
		success: function(response) {
			console.log("Success response:", response);
			if (response.success) {
				// Eski alertleri temizle
				$('.response-alert').remove();

				// Başarı mesajı göster
				let successMsg = formData.type === 'randevu' ? 
					'Randevunuz başarıyla oluşturuldu! Sizi en kısa sürede arayacağız.' :
					'Talebiniz alındı! Sizi en kısa sürede arayacağız.';
				
				activeForm.prepend(
					'<span id="response-alert" class="alert alert-success response-alert" style="display:block;width:100%">' + successMsg + '</span>'
				);
				
				// WhatsApp'a bildirim gönder (pop-up)
				SendWhatsAppNotification(formData);
				
				// Formu temizle
				setTimeout(function() {
					activeForm[0].reset();
					$('.response-alert').remove();
				}, 3000);
			} else {
				// Başarısız mesaj
				activeForm.prepend(
					'<span id="response-alert" class="alert alert-danger response-alert" style="display:block;width:100%">Bir hata oluştu. Lütfen tekrar deneyiniz.</span>'
				);
				setTimeout(function() {
					$('.response-alert').remove();
				}, 4000);
			}
		},
		error: function(xhr, status, error) {
			console.log("AJAX Error - Status:", xhr.status);
			console.log("AJAX Error - StatusText:", xhr.statusText);
			console.log("AJAX Error - Response:", xhr.responseText);
			console.log("AJAX Error - Error:", error);
			
			// Bağlantı hatası mesajı
			activeForm.prepend(
				'<span id="response-alert" class="alert alert-danger response-alert" style="display:block;width:100%">Sunucuya bağlanırken hata oluştu. Lütfen tekrar deneyiniz.</span>'
			);
			setTimeout(function() {
				$('.response-alert').remove();
			}, 4000);
		}
	});
}

function SendWhatsAppNotification(formData) {
	let message = "🔔 YENİ TALEP ALINDI\n\n";
	message += "👤 Ad Soyad: " + formData.firstname + " " + formData.lastname + "\n";
	message += "📧 Email: " + formData.email + "\n";
	message += "📱 Telefon: " + formData.phone + "\n";
	message += "📋 Proje: " + formData.project + "\n";
	
	if (formData.type === 'randevu') {
		message += "📅 Tarih: " + formData.randevuTarihi + "\n";
		message += "⏰ Saat: " + formData.randevuSaati + "\n";
	} else if (formData.type === 'iletisim') {
		message += "💬 Not: " + formData.message + "\n";
	}
	
	let encodedMessage = encodeURIComponent(message);
	let whatsappUrl = "https://wa.me/+" + ownerWhatsApp + "?text=" + encodedMessage;
	
	window.open(whatsappUrl, '_blank');
}
