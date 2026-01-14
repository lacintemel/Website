let ppApiToken = "";

$(document).ready(function(){
	GetToken("d838c210-1cd6-44aa-b455-e2c7d9c8e8cb@api.planports.com", "Arso@2023.—.");
	
	// Randevu formu gönderme
	$(document).on('click', '#randevuSendForm', function () {
    	let form = $('#randevuForm');

    	let reminderNote = 'Proje: ' + form.find('input[name="project"]').val();
    	reminderNote += '\nRandevu Saati: ' + form.find('select[name="randevu"]').val();
    	reminderNote += '\nRandevu Tarihi: ' + form.find('input[name="randevu-tarihi"]').val();

    	CreateLead(
    		ppApiToken,
    		form.find('input[name="kvkk-check"]').prop("checked"),
    		form.find('input[name="firstname"]').val() + " " + form.find('input[name="lastname"]').val(),
    		form.find('input[name="email"]').val(),
    		form.find('input[name="telephone"]').val(),
    		reminderNote,
    		form // aktif formu buradan gönderiyoruz
    	);
    });

	// İletişim formu gönderme
    $(document).on('click', '#iletisimSendForm', function () {
        let form = $('#iletisimForm');
        
        let reminderNote = 'Proje: ' + form.find('input[name="project"]').val();
        reminderNote += '\nNot: ' + form.find('input[name="message"]').val();
        
        CreateLead(
        	ppApiToken,
        	form.find('input[name="kvkk-check"]').prop("checked"),
        	form.find('input[name="firstname"]').val() + " " + form.find('input[name="lastname"]').val(),
        	form.find('input[name="email"]').val(),
        	form.find('input[name="telephone"]').val(),
        	reminderNote,
        	form // aktif form
        );
    });

});


function GetToken(username, password) {
    $.ajax({
        url: "https://www.planports.com/api/token",
        type: "POST",
        contentType: 'application/json; charset=UTF-8',
        data: JSON.stringify({
            "Email": username,
            "Password": password
        }),
        success: function (result) {
            ppApiToken = result.AccessToken;
        }
    });
}


function CreateLead(token, kvkkIsChecked, namesurname, email, phonenumber, reminderNote, activeForm){

    if (token && kvkkIsChecked == true && namesurname) {

		var contactInfos = [];
		contactInfos.push({
			"SubTypeName":"PersonalEmail",
			"ContactValue":email
		});
		
		if(phonenumber){
			contactInfos.push({
				"SubTypeName":"MobileTelNumber",
				"ContactValue":phonenumber
			});
		}
		
		$.ajax({
            url: "https://www.planports.com/api/v1/PpContacts",
            type: "POST",
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', 'Bearer ' + token);
            },
            contentType: 'application/json; charset=UTF-8',
            data: JSON.stringify({
				"IsOrganization":false,
				"CardStates": ["0"],
                "NameSurname": namesurname,
				"ContactInfos": contactInfos,
				"ReminderNote": reminderNote,
				"Source":"Web Form",
				"Campaign":"Contact Form"
            }),
            success: function (result, textStatus, xhr) {
                console.log(result.ResultMessage);

                if (xhr.status === 201) {

                    // Eski alertleri temizle
                    $('.response-alert').remove();

                    // Mesajı ilgili formun içine ekle
                    activeForm.prepend(
                        '<span id="response-alert" class="alert alert-success response-alert" style="display:block;width:100%">Mailiniz başarıyla gönderilmiştir.</span>'
                    );
                }
			}
		});
	}
}
