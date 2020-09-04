#!/usr/bin/env bash


for IMGNAME in ./*.svg; do
    echo $IMGNAME
    BASENAME="${IMGNAME%.*}"
    echo $BASENAME

    #cairosvg $IMGNAME -o $BASENAME.pdf
    inkscape --file=$BASENAME.svg --export-area-drawing --without-gui --export-pdf=$BASENAME.pdf

    inkscape -z --export-dpi 1200 -e $BASENAME.png  $BASENAME.pdf
    convert $BASENAME.png -background white -alpha remove $BASENAME.gif
    convert $BASENAME.gif $BASENAME.png
    rm $BASENAME.gif
    
    echo ==================================
done

mv *.pdf *.png ../../Figures/
