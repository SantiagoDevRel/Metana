# UNSAFE CODE FOR UPGRADEABLE CONTRACTS

MUST NOT HAVE:
-constructor
-initialize called more than once
-reorder storage (should have same layout for the storage of the v1 contract)
-selfdestruct/kill function