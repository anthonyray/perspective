#!/bin/bash
convert "$1" -matte -virtual-pixel transparent -distort Perspective '324,127 324,127   775,134 775,134   994,686 775,687   57,675 324,681' - | convert - -flip - | convert - -crop 443x538+326+41  "$2"