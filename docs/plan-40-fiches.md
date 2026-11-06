# Plan du pack — 40 fiches CCNA 200-301 v1.1

Répartition selon la pondération de l'examen :

| Domaine | Poids | Fiches | N° |
|---|---|---|---|
| 1.0 Network Fundamentals | 20 % | 8 | 01–08 |
| 2.0 Network Access | 20 % | 8 | 09–16 |
| 3.0 IP Connectivity | 25 % | 10 | 17–26 |
| 4.0 IP Services | 10 % | 4 | 27–30 |
| 5.0 Security Fundamentals | 15 % | 6 | 31–36 |
| 6.0 Automation & Programmability | 10 % | 4 | 37–40 |
| **Total** | **100 %** | **40** | |

## 1.0 Network Fundamentals

| N° | Blueprint | Titre | Objectif de l'examen |
|---|---|---|---|
| 01 | 1.1 | Composants réseau et leurs rôles | Expliquer le rôle des routeurs, switchs L2/L3, NGFW, IPS, AP, contrôleurs, terminaux, serveurs et PoE. |
| 02 | 1.2 · 1.12 | Topologies, cloud et virtualisation | Décrire les architectures 2-tier, 3-tier, spine-leaf, WAN, SOHO, on-premise / cloud ; expliquer VM, conteneurs et VRF. |
| 03 | 1.3 · 1.4 | Câblage et défauts d'interface | Comparer fibre monomode, multimode et cuivre ; identifier collisions, erreurs, duplex et vitesse discordants. |
| 04 | 1.5 | TCP et UDP comparés | Comparer TCP et UDP (connexion, fiabilité, fenêtrage, ports usuels). |
| 05 | 1.6 · 1.7 · 1.10 | IPv4 : sous-réseaux et adressage privé | Configurer et vérifier l'adressage IPv4 et le découpage ; décrire RFC 1918 ; vérifier les paramètres IP d'un client Windows, macOS, Linux. |
| 06 | 1.8 · 1.9 | IPv6 : adressage et types | Configurer et vérifier un préfixe IPv6 ; décrire GUA, ULA, link-local, anycast, multicast, EUI-64 modifié. |
| 07 | 1.11 | Principes radio du Wi-Fi | Décrire canaux non chevauchants, SSID, RF et chiffrement. |
| 08 | 1.13 | Commutation et table MAC | Décrire apprentissage et vieillissement MAC, commutation, inondation des trames. |

## 2.0 Network Access

| N° | Blueprint | Titre | Objectif de l'examen |
|---|---|---|---|
| 09 | 2.1 | VLAN : ports données et voix | Configurer et vérifier des VLAN (plage normale) sur plusieurs switchs, ports d'accès data et voice, VLAN par défaut. |
| 10 | 2.2 | Trunk 802.1Q et native VLAN | Configurer et vérifier les trunks 802.1Q et le native VLAN entre switchs. |
| 11 | 2.1 | Routage inter-VLAN | Configurer et vérifier la connectivité inter-VLAN (router-on-a-stick, SVI). |
| 12 | 2.3 | Découverte L2 : CDP, LLDP | Configurer et vérifier CDP et LLDP. |
| 13 | 2.4 | EtherChannel LACP | Configurer et vérifier un EtherChannel L2/L3 en LACP. |
| 14 | 2.5 | Rapid PVST+ : élection et rôles | Interpréter root bridge, root port, rôles et états de ports, priorités primary/secondary. |
| 15 | 2.5 | Rapid PVST+ : PortFast et protections | Interpréter PortFast, BPDU Guard, BPDU Filter, Root Guard, Loop Guard. |
| 16 | 2.6 · 2.7 | Architectures WLAN Cisco | Décrire architectures sans fil, modes d'AP, connexions physiques AP/WLC (access, trunk, LAG). |

## 3.0 IP Connectivity

| N° | Blueprint | Titre | Objectif de l'examen |
|---|---|---|---|
| 17 | 3.1 | Lire la table de routage | Interpréter code protocole, préfixe, masque, next hop, AD, métrique, gateway of last resort. |
| 18 | 3.2 | Décision d'acheminement du routeur | Déterminer le choix d'une route : longest prefix match, AD, métrique. |
| 19 | 3.3 | Routes statiques IPv4 | Configurer et vérifier routes statiques réseau et hôte en IPv4. |
| 20 | 3.3 | Routes statiques IPv6 | Configurer et vérifier routes statiques IPv6 (next hop global, link-local, interface). |
| 21 | 3.3 | Routes par défaut et flottantes | Configurer et vérifier route par défaut et floating static (IPv4 / IPv6). |
| 22 | 3.4 | OSPFv2 : voisinage et états | Décrire Hello/Dead, conditions d'adjacence, états des voisins. |
| 23 | 3.4 | OSPFv2 : configuration zone unique | Configurer et vérifier OSPFv2 single area (network, interface, passive-interface). |
| 24 | 3.4 | OSPF : DR, BDR, types réseau | Configurer et vérifier élection DR/BDR, réseaux broadcast et point-to-point. |
| 25 | 3.4 | OSPF : router ID et dépannage | Configurer le router ID ; vérifier et dépanner les adjacences. |
| 26 | 3.5 | FHRP : HSRP, VRRP, GLBP | Décrire le rôle et le fonctionnement des protocoles de redondance du premier saut. |

## 4.0 IP Services

| N° | Blueprint | Titre | Objectif de l'examen |
|---|---|---|---|
| 27 | 4.1 | NAT statique, pool et PAT | Configurer et vérifier l'inside source NAT statique et par pool (overload). |
| 28 | 4.2 · 4.3 · 4.6 | Services IP : DHCP, DNS, NTP | Expliquer DHCP et DNS ; configurer client et relais DHCP ; configurer NTP client / serveur. |
| 29 | 4.4 · 4.5 · 4.9 | Supervision : SNMP, Syslog, TFTP | Expliquer SNMP ; décrire facilities et niveaux Syslog ; décrire TFTP / FTP. |
| 30 | 4.7 | QoS : comportement par saut | Expliquer classification, marquage, files, congestion, policing et shaping. |

## 5.0 Security Fundamentals

| N° | Blueprint | Titre | Objectif de l'examen |
|---|---|---|---|
| 31 | 5.1 · 5.2 · 5.4 | Concepts et politiques de sécurité | Définir menace, vulnérabilité, exploit, mitigation ; décrire programme de sécurité et politiques de mots de passe (MFA, certificats, biométrie). |
| 32 | 5.3 · 4.8 · 2.8 | Accès aux équipements : SSH | Configurer et vérifier mots de passe locaux et SSH ; décrire console, Telnet, HTTP(S), accès cloud. |
| 33 | 5.8 · 5.5 | AAA et VPN IPsec | Comparer authentification, autorisation, accounting (RADIUS / TACACS+) ; décrire VPN IPsec site-to-site et remote access. |
| 34 | 5.6 | Listes de contrôle d'accès | Configurer et vérifier ACL standard et étendues, numérotées et nommées. |
| 35 | 5.7 | Sécurité L2 : port security, snooping | Configurer et vérifier port security, DHCP snooping, Dynamic ARP Inspection. |
| 36 | 5.9 · 5.10 · 2.9 | Wi-Fi : WPA2, WPA3, GUI WLC | Décrire WPA, WPA2, WPA3 ; interpréter et configurer un WLAN WPA2-PSK dans la GUI du WLC. |

## 6.0 Automation & Programmability

| N° | Blueprint | Titre | Objectif de l'examen |
|---|---|---|---|
| 37 | 6.1 · 6.2 · 6.4 | Automatisation, contrôleurs et IA | Expliquer l'impact de l'automatisation ; comparer réseau traditionnel et contrôlé ; expliquer IA générative / prédictive et ML. |
| 38 | 6.3 | SDN : plans et API | Décrire overlay, underlay, fabric, séparation control / data plane, API northbound / southbound. |
| 39 | 6.5 · 6.7 | API REST et JSON | Décrire authentification, CRUD, verbes HTTP, encodage ; reconnaître les composants JSON. |
| 40 | 6.6 | Ansible et Terraform | Reconnaître les capacités d'Ansible et de Terraform. |

## Fiches pilotes proposées (étape 2)

- Fondamentaux : **05** — IPv4 : sous-réseaux et adressage privé
- Configuration : **23** — OSPFv2 : configuration zone unique
- Sécurité : **34** — Listes de contrôle d'accès
