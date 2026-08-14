output "public_ip" {
  description = "Public IPv4 address of the temporary application server."
  value       = aws_instance.app.public_ip
}

output "ui_url" {
  description = "Frontend URL used by Playwright."
  value       = "http://${aws_instance.app.public_ip}:3000"
}

output "api_url" {
  description = "Backend URL used by API tests."
  value       = "http://${aws_instance.app.public_ip}:4000"
}
