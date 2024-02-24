etcd
====

This role configures an etcd cluster.

## Variables


| name | required | default | description |
| ---- | ---------| ------- | ----------- |
| hosts | **yes** | | a list of hosts that comprise the cluster |
| alias | **yes** | | etcd cluster name for a host |
| address | **yes** | | address to advertise to peers |
| endpoint | **yes** | | etcd connection string for host |
| auth\_hosts| **yes** | | list of authorized hosts (used in TLS SANs) |
| ip | no | 0.0.0.0 | listening address |
| ca\_pem | no | | certificate authority to used for secured setups |
| db\_pem | no | | database cert to used for secured setups |
| db\_key | no | | database key to used for secured setups |
| keygen | no | no | generate keys for the deployment |
| client\_cert\_auth | no | yes | authenticate clients with certs |
| version | no | 3.5.12 | etcd database server version to install |
| server | no | no | install etcd server on this machine |
| server\_name | no | etcd-server | name of the etcd server for systemd and docker |
| proxy | no | no | install etcd proxy server on this machine |

### Proxy variables

The following are used when `proxy=true`

| name | required | default | description |
| ---- | ---------| ------- | ----------- |
| proxy\_name | **yes** | | name of proxy |
| proxy\_endpoints | **yes** | | etcd cluster endpoints |
| proxy\_port | no | 2379 | listening port |
| proxy\_address | no | 127.0.0.1 | listening address |
| proxy\_verify_peer | no | yes | verify the server tls cert |
| ca\_pem | no | | certificate authority to used for secured setups |
| db\_pem | no | | database cert to used for secured setups |
| db\_key | no | | database key to used for secured setups |

## Notes

Etcd instances are managed via systemd using either `server_name` or `proxy_name` as the service name.

```shell
service etcd-server status
journalctl -u etcd-server
```

## Tests

Tests contained in the `test/` directory use [raven](https://gitlab.com/mergetb/tech/raven).

```
./run.sh
./setup-etcd.sh
```

## Examples

### Single instance deployment

```yaml
hosts: a
become: true
vars:
  a: 10.0.0.1
tasks:
  - import_role:
      name: etcd
    vars:
      keygen: yes
      server: yes
      alias: a
      address: "{{ansible_eth0.ipv4.address}}"
      ip: "{{ansible_eth0.ipv4.address}}"
      auth_hosts: [dba, 10.0.0.1]
      hosts:
        - alias: a
          endpoint: a=https://{{ansible_eth0.ipv4.address}}:2380
```

### Cluster deployment

```yaml
hosts: localhost
tasks:
  - import_role:
      name: etcd
    vars:
      keygen: yes
      local: yes
      auth_hosts:
        - dba,10.0.0.1
        - dbb,10.0.0.2
        - dbc,10.0.0.3

hosts: [a,b,c]
become: true
vars:
  a: 10.0.0.1
  b: 10.0.0.2
  c: 10.0.0.3
tasks:
  - import_role:
      name: etcd
    vars:
      server: yes
      alias: "{{inventory_hostname_short}}"
      address: "db{{inventory_hostname_short}}"
      ip: "{{vars[inventory_hostname_short]}}"
      hosts:
        - alias: a
          endpoint: a=https://dba:2380
        - alias: b
          endpoint: b=https://dbb:2380
        - alias: c
          endpoint: c=https://dbc:2380
```

### Proxy

```yaml
hosts: x
become: true
vars:
tasks:
  - import_role:
      name: etcd
    vars:
      proxy: yes
      proxy_name: llama
      proxy_endpoints: https://dba:2379,https://dbb:2379,https://dbc:2379
      ca_pem: /etc/etcd/ca.pem
      db_pem: /etc/etcd/db.pem
      db_key: /etc/etcd/db-key.pem
```
