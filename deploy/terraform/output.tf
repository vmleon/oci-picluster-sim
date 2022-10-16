output "instances" {
  value = oci_core_instance.gen.*.public_ip
}
