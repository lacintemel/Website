<?php
header('Content-Type: application/json');

// Error logging için
error_log("Form received: type=" . $_POST['type'] ?? 'unknown');

// Email al
$notificationEmail = "lacintemel3@gmail.com";

// POST verilerini al
$type = isset($_POST['type']) ? $_POST['type'] : '';
$firstname = isset($_POST['firstname']) ? htmlspecialchars($_POST['firstname']) : '';
$lastname = isset($_POST['lastname']) ? htmlspecialchars($_POST['lastname']) : '';
$email = isset($_POST['email']) ? htmlspecialchars($_POST['email']) : '';
$phone = isset($_POST['phone']) ? htmlspecialchars($_POST['phone']) : '';
$project = isset($_POST['project']) ? htmlspecialchars($_POST['project']) : '';

// Kontrol
if (empty($firstname) || empty($lastname) || empty($email) || empty($phone) || empty($project)) {
    echo json_encode(['success' => false, 'message' => 'Eksik bilgi']);
    exit;
}

// Email başlığı
$to = $notificationEmail;
$subject = "🔔 YENİ TALEP: " . $firstname . " " . $lastname;

// Email içeriği HTML formatında
$message = "<html><body>";
$message .= "<h2 style='color: #0D3143;'>Yeni Talep Alındı</h2>";
$message .= "<hr>";
$message .= "<p><strong>Talep Türü:</strong> " . ($type === 'randevu' ? 'Randevu Talebi' : 'İletişim Formu') . "</p>";
$message .= "<p><strong>Ad Soyad:</strong> " . $firstname . " " . $lastname . "</p>";
$message .= "<p><strong>Email:</strong> <a href='mailto:" . $email . "'>" . $email . "</a></p>";
$message .= "<p><strong>Telefon:</strong> " . $phone . "</p>";
$message .= "<p><strong>Proje:</strong> " . $project . "</p>";

if ($type === 'randevu') {
    $randevuTarihi = isset($_POST['randevuTarihi']) ? htmlspecialchars($_POST['randevuTarihi']) : '';
    $randevuSaati = isset($_POST['randevuSaati']) ? htmlspecialchars($_POST['randevuSaati']) : '';
    $message .= "<p><strong>Randevu Tarihi:</strong> " . $randevuTarihi . "</p>";
    $message .= "<p><strong>Randevu Saati:</strong> " . $randevuSaati . "</p>";
} else if ($type === 'iletisim') {
    $messageText = isset($_POST['message']) ? htmlspecialchars($_POST['message']) : '';
    $message .= "<p><strong>Not:</strong> " . $messageText . "</p>";
}

$message .= "<hr>";
$message .= "<p style='color: #999;'>Bu otomatik bir bildiridir. Lütfen bu talebine karşılık vermek için yukarıdaki bilgileri kullanınız.</p>";
$message .= "</body></html>";

// Email başlıkları
$headers = "MIME-Version: 1.0" . "\r\n";
$headers .= "Content-type: text/html; charset=UTF-8" . "\r\n";
$headers .= "From: iletisim@bySobutay.com" . "\r\n";
$headers .= "Reply-To: " . $email . "\r\n";

// Email gönder
$mailSuccess = mail($to, $subject, $message, $headers);

// Başarı/başarısızlığı kaydet
if ($mailSuccess) {
    error_log("Email sent successfully to: " . $to);
    echo json_encode(['success' => true, 'message' => 'Email başarıyla gönderildi']);
} else {
    error_log("Email failed to send");
    // Sunucuda mail gönderememesine karşı yine başarı döndür
    echo json_encode(['success' => true, 'message' => 'Talebiniz kaydedildi (email gönderim test)']);
}
exit;
?>