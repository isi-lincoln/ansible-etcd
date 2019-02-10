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
| ip | **yes** | | listening address |
| ca\_pem | no | | certificate authority to used for secured setups |
| db\_pem | no | | database cert to used for secured setups |
| db\_key | no | | database key to used for secured setups |
| keygen | no | no | generate keys for the deployment |
| auth\_hosts| yes | | list of authorized hosts |
| client\_cert\_auth | no | yes | authenticate clients with certs |

## Notes

Etcd instances are run via systemd.

```shell
service etcd status
journalctl -u etcd
```

## Examples

### Single instance deployment

```yaml
import_role:
  name: etcd
vars:
  keygen: yes
  install: yes
  xname: db0
  ip: 10.10.0.99
  hostname: localhost
  hosts:
    - xname: db0
      endpoint: db0=https://localhost:2380
```

### Cluster Deployment

```yaml
- hosts: localhost
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

- hosts: [a,b,c]
  become: true
  vars:
    a: 10.0.0.1
    b: 10.0.0.2
    c: 10.0.0.3
  tasks:
    - import_role:
        name: etcd
      vars:
        install: yes
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
