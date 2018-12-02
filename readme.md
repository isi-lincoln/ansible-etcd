etcd
====

This role installs configures and deploys a single etcd cluster node. Run it over multiple nodes to create an etcd cluster.

The following variables **must** be provided for this role to work.

- `ca.pem`: location of the certificate authority chain used by etcd cluster members in validating client certificates.
- `db.pem`: location of the db certificate used by etcd cluster members to validate peer certificates
- `db.key`: key used by etcd peers for secure communication

`ca.pem` and `db.pem` must be the same across all cluster members. `db.key` may differ across cluster members. If they are different they **must all be signed by the same `db.pem`**.

- `hosts`: a list of hosts tht comrise the cluster for example
- `xname`: the logical etcd name host currently being configured (commonly `inventory_hostname_short`)
- `hostname`: the name of the host currently being configured (commonly `inventory_hostname_short`)
- `ip`: the ip of the host currently being configured

```yaml
hosts:
  - xname: db0
    endpoint: db0=https://db0:2380

  - xname: db1
    endpoint: db1=https://db1:2380

  - xname: db2
    endpoint: db2=https://db2:2380
```

Once this role has been executed successfully, the following are true.

- etcd is executing on the target host as a systemd service
- etcd will be started by systemd on each subsequent boot

The healt of each individual etcd node can be checked locally via

```shell
service etcd status
journalctl -u etcd
```
