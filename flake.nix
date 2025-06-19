{
  description = "Flake para entorno de desarrollo con Node.js, npm y Nushell";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable"; # Puedes cambiar a otra versión estable si prefieres
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs {
          inherit system;
        };
      in {
        devShells.default = pkgs.mkShell {
          buildInputs = [
            pkgs.nodejs_latest
          ];

          shellHook = ''
            echo "Entorno de desarrollo listo con Node.js!!!"
          '';
        };
      });
}

