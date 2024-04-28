.PHONY: devshell
devshell:
	nix develop -c $$SHELL

.PHONY: fmt
	nix fmt

