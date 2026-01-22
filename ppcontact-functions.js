let notificationEmail = "lacintemel3@gmail.com";
let ownerWhatsApp = "905367179731";

$(document).ready(function(){
	
	// Randevu formu gönderme
	$(document).on('click', '#randevuSendForm', function () {
    	let form = $('#randevuForm');
    	
    	let firstname = form.find('input[name="firstname"]').val();
    	let lastname = form.find('input[name="lastname"]').val();
    	let email = form.find('input[name="email"]').val();
    	let phone = form.find('input[name="telephone"]').val();
    	let project = form.find('input[name="project"]').val();
    	let randevuSaati = form.find('select[name="randevu"]').val();
    	let randevuTarihi = form.find('input[name="randevu-tarihi"]').val();
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
        let lastname = form.find('input[name="lastname"]').val();
        let email = form.find('input[name="email"]').val();
        let phone = form.find('input[name="telephone"]').val();
        let project = form.find('input[name="project"]').val();
        let message = form.find('input[name="message"]').val();
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
				activeForm.prepend(
					'<span id="response-alert" class="alert alert-success response-alert" style="display:block;width:100%">Talebiniz alındı! Sizi en kısa sürede arayacağız.</span>'
				);
				
				// WhatsApp'a bildirim gönder (pop-up)
				SendWhatsAppNotification(formData);
				
				// Formu temizle
				setTimeout(function() {
					activeForm[0].reset();
					$('.response-alert').remove();
				}, 3000);
			} else {
				alert("Bir hata oluştu: " + response.message);
			}
		},
		error: function(xhr, status, error) {
			console.log("AJAX Error - Status:", xhr.status);
			console.log("AJAX Error - StatusText:", xhr.statusText);
			console.log("AJAX Error - Response:", xhr.responseText);
			console.log("AJAX Error - Error:", error);
			alert("Sunucuya bağlanırken hata oluştu. Detay: " + error + " (Status: " + xhr.status + ")");
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
	let whatsappUrl = "https://wa.me/" + ownerWhatsApp + "?text=" + encodedMessage;
	
	window.open(whatsappUrl, '_blank');
}
