variable "num_instances" {
  default = "2"
}

variable "ocpus" {
  default = "1"
  type    = number
}

variable "memory_in_gbs" {
  default = "16"
  type    = number
}

variable "shape" {
  default = "VM.Standard.E4.Flex"
}

data "oci_core_images" "ol8_images" {
  compartment_id           = var.compartment_ocid
  shape                    = var.shape
  operating_system         = "Oracle Linux"
  operating_system_version = "8"
  sort_by                  = "TIMECREATED"
  sort_order               = "DESC"
}

data "oci_identity_availability_domain" "ad" {
  compartment_id = var.tenancy_ocid
  ad_number      = 1
}

resource "oci_core_instance" "gen" {
  count               = var.num_instances
  availability_domain = data.oci_identity_availability_domain.ad.name
  compartment_id      = var.compartment_ocid
  display_name        = "gen${count.index}"
  shape               = var.shape

  metadata = {
    ssh_authorized_keys = var.ssh_public_key
  }

  shape_config {
    ocpus         = var.ocpus
    memory_in_gbs = var.memory_in_gbs
  }

  create_vnic_details {
    subnet_id                 = oci_core_subnet.publicsubnet.id
    display_name              = "gen"
    assign_public_ip          = true
    assign_private_dns_record = true
    hostname_label            = "gen${count.index}"
  }

  source_details {
    source_type = "image"
    source_id   = data.oci_core_images.ol8_images.images[0].id
  }

  timeouts {
    create = "60m"
  }
}
