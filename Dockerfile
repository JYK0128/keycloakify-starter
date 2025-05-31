FROM quay.io/keycloak/keycloak:26.2.4

COPY ./dist_keycloak /opt/keycloak/providers/
