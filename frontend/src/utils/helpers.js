export const showMessage = (message, type = 'success') => {
  const alertDiv = document.createElement('div');
  alertDiv.className = 'alert alert-' + type;
  alertDiv.textContent = message;
  alertDiv.style.position = 'fixed';
  alertDiv.style.top = '20px';
  alertDiv.style.right = '20px';
  alertDiv.style.padding = '15px 20px';
  alertDiv.style.borderRadius = '5px';
  alertDiv.style.color = 'white';
  alertDiv.style.fontWeight = 'bold';
  alertDiv.style.zIndex = '10000';
  alertDiv.style.backgroundColor = type === 'success' ? '#28a745' : '#dc3545';
  
  document.body.appendChild(alertDiv);
  
  setTimeout(() => {
    if (document.body.contains(alertDiv)) {
      document.body.removeChild(alertDiv);
    }
  }, 3000);
};

export const validatePhone = (phone) => {
  return phone.length >= 10;
};