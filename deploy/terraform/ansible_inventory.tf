resource "local_file" "ansible_inventory" {
  content = templatefile("${path.module}/ansible_inventory.tftpl",
    {
      gen_hostnames  = oci_core_instance.gen.*.hostname_label
      gen_public_ips = oci_core_instance.gen.*.public_ip
    }
  )
  filename = "${path.module}/generated/server.ini"
}
