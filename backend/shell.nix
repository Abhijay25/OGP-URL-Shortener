{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  buildInputs = with pkgs; [
    prisma-engines_7
    openssl
    nodejs
  ];

  shellHook = ''
    export PRISMA_SCHEMA_ENGINE_BINARY="${pkgs.prisma-engines_7}/bin/schema-engine"
    export PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1
  '';
}
