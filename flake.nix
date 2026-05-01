{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs =
    {
      self,
      nixpkgs,
      flake-utils,
    }:
    flake-utils.lib.eachDefaultSystem (
      system:
      let
        pkgs = import nixpkgs {
          inherit system;
        };
        isDarwin = pkgs.stdenv.isDarwin;
      in
      {
        devShells.default = pkgs.mkShell {
          packages = with pkgs; [
            nodejs
            yarn-berry
            pkgs.ffmpeg_6-full
          ];

          FFMPEG_PATH = "${pkgs.ffmpeg_6-full}/bin/ffmpeg";
          FFPROBE_PATH = "${pkgs.ffmpeg_6-full}/bin/ffprobe";
        };
      }
    );
}
