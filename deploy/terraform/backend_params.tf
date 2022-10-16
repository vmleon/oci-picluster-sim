resource "local_file" "backend_params" {
  content = templatefile("${path.module}/backend_params.tftpl",
    {
      cluster_size             = var.cluster_size
      broadcast_refresh_update = var.broadcast_refresh_update
      instances_per_node       = var.instances_per_node
      server_url               = var.server_url
    }
  )
  filename = "${path.module}/generated/backend_params.json"
}
