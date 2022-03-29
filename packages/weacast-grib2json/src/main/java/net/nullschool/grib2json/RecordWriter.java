package net.nullschool.grib2json;

import org.joda.time.DateTime;
import org.joda.time.DateTimeZone;
import ucar.grib.grib2.*;

import javax.json.stream.JsonGenerator;
import java.io.IOException;
import java.util.*;

import static ucar.grib.grib1.Grib1Tables.*;
import static ucar.grib.grib2.Grib2Tables.*;
import static ucar.grib.grib2.ParameterTable.*;
import static ucar.grib.GribNumbers.*;

/**
 * 2013-10-25<p/>
 *
 * @author Cameron Beccario
 */
final class RecordWriter {

    private final JsonGenerator jg;
    private final Grib2Record record;
    private final Grib2IndicatorSection ins;
    private final Grib2IdentificationSection ids;
    private final Grib2Pds pds;
    private final Grib2GDSVariables gdsv;
    private final boolean includeCodeDescriptions;
    private Set<String> keys = new HashSet<>();

    RecordWriter(JsonGenerator jg, Grib2Record record, boolean includeCodeDescriptions) {
        this.jg = Objects.requireNonNull(jg);
        this.record = record;
        this.ins = record.getIs();
        this.ids = record.getId();
        this.pds = record.getPDS().getPdsVars();
        this.gdsv = record.getGDS().getGdsVars();
        this.includeCodeDescriptions = includeCodeDescriptions;
    }

    private boolean isUnique(String key) {
        return keys.add(key);
    }

    private void write(String name, int value) {
        assert isUnique(name);
        jg.write(name, value);
    }

    private void writeIfSet(String name, int value) {
        assert isUnique(name);
        if (value != UNDEFINED) {
            jg.write(name, value);
        }
    }

    private void write(String name, long value) {
        assert isUnique(name);
        jg.write(name, value);
    }

    private void write(String name, float value) {
        assert isUnique(name);
        jg.write(name, new FloatValue(value));
    }

    private void writeIfSet(String name, float value) {
        assert isUnique(name);
        if (value != UNDEFINED) {
            jg.write(name, new FloatValue(value));
        }
    }

    private void write(String name, double value) {
        assert isUnique(name);
        jg.write(name, value);
    }

    private void write(String name, String value) {
        assert isUnique(name);
        jg.write(name, value);
    }

    private void write(String name, int code, String description) {
        write(name, code);
        if (includeCodeDescriptions) {
            write(name + "Name", description);
        }
    }

    private void writeIndicator() {
        write("discipline", ins.getDiscipline(), ins.getDisciplineName());
        write("gribEdition", ins.getGribEdition());
        write("gribLength", ins.getGribLength());
    }

    private void writeIdentification() {
        write("center_id", ids.getCenter_id(), getCenter_idName(ids.getCenter_id()));  // Originating Center
        write("subcenter_id", ids.getSubcenter_id());  // Originating Sub-Center
        write("refTime", new DateTime(ids.getRefTime()).withZone(DateTimeZone.UTC).toString());  // Reference Time
        write("significanceOfRT", ids.getSignificanceOfRT(), ids.getSignificanceOfRTName()); // Significance of Reference Time
        write("productStatus", ids.getProductStatus(), ids.getProductStatusName());
        write("productType", ids.getProductType(), ids.getProductTypeName());
    }

    private void writeProduct() {
        final int productDef = pds.getProductDefinitionTemplate();
        final int discipline = ins.getDiscipline();
        final int paramCategory = pds.getParameterCategory();
        final int paramNumber = pds.getParameterNumber();

        write("productDefinition", productDef, codeTable4_0(productDef));
        write("parameterCategory", paramCategory, getCategoryName(discipline, paramCategory));
        write("parameter", paramNumber, getParameterName(discipline, paramCategory, paramNumber));
        write("parameterUnit", getParameterUnit(discipline, paramCategory, paramNumber));
        write("genProcessType", pds.getGenProcessType(), codeTable4_3(pds.getGenProcessType()));  // Generating Process Type
        write("forecastTime", pds.getForecastTime());
        write("levelType1", pds.getLevelType1(), codeTable4_5(pds.getLevelType1()));  // First Surface Type
        write("levelValue1", pds.getLevelValue1());
        write("levelType2", pds.getLevelType2(), codeTable4_5(pds.getLevelType2()));  // Second Surface Type
        write("levelValue2", pds.getLevelValue2());
    }

    private void writeGridShape() {
        write("shape", gdsv.getShape(), codeTable3_2(gdsv.getShape()));  // grid shape
        switch (gdsv.getShape()) {
            case 1:
                write("earthRadius", gdsv.getEarthRadius());  // Spherical earth radius
                break;
            case 3:
                write("majorAxis", gdsv.getMajorAxis());  // Oblate earth major axis
                write("minorAxis", gdsv.getMinorAxis());  // Oblate earth minor axis
                break;
        }
    }

    private void writeGridSize() {
        write("gridUnits", gdsv.getGridUnits());
        write("resolution", gdsv.getResolution());  // Resolution & Component flags
        write("winds", isBitSet(gdsv.getResolution(), BIT_5) ? "relative" : "true");
        write("scanMode", gdsv.getScanMode());
        write("nx", gdsv.getNx());  // Number of points along parallel
        write("ny", gdsv.getNy());  // Number of points along meridian
    }

    private void writeLatLongBounds() {
        writeIfSet("la1", gdsv.getLa1());  // Latitude of first grid point
        writeIfSet("lo1", gdsv.getLo1());  // Longitude of first grid point
        writeIfSet("la2", gdsv.getLa2());  // Latitude of last grid point
        writeIfSet("lo2", gdsv.getLo2());  // Longitude of last grid point
        writeIfSet("dx", gdsv.getDx());    // i direction increment
        writeIfSet("dy", gdsv.getDy());    // j direction increment
    }

    private void writeRotationAndStretch() {
        writeIfSet("spLat", gdsv.getSpLat());  // Latitude of southern pole
        writeIfSet("spLon", gdsv.getSpLon());  // Longitude of southern pole
        writeIfSet("rotationAngle", gdsv.getRotationAngle());
        writeIfSet("poleLat", gdsv.getPoleLat());
        writeIfSet("poleLon", gdsv.getPoleLon());
        writeIfSet("stretchingFactor", gdsv.getStretchingFactor());
    }

    private void writeAngle() {
        writeIfSet("angle", gdsv.getAngle());
        writeIfSet("basicAngle", gdsv.getBasicAngle());
        writeIfSet("subDivisions", gdsv.getSubDivisions());
    }

    private void writeLatLongGrid() {
        writeGridShape();
        writeGridSize();
        writeAngle();
        writeLatLongBounds();
        writeRotationAndStretch();
        writeIfSet("np", gdsv.getNp());  // Number of parallels
    }

    private void writeMercatorGrid() {
        writeGridShape();
        writeGridSize();
        writeAngle();
        writeLatLongBounds();
    }

    private void writePolarStereographicGrid() {
        writeGridShape();
        writeGridSize();
        writeLatLongBounds();
    }

    private void writeLambertConformalGrid() {
        writeGridShape();
        writeGridSize();
        writeLatLongBounds();
        writeRotationAndStretch();

        write("laD", gdsv.getLaD());
        write("loV", gdsv.getLoV());
        write("projectionFlag", gdsv.getProjectionFlag());  // projection center
        write("latin1", gdsv.getLatin1());
        write("latin2", gdsv.getLatin2());
    }

    private void writeSpaceOrOrthographicGrid() {
        writeGridShape();
        writeGridSize();
        writeAngle();
        writeLatLongBounds();

        write("lap", gdsv.getLap());  // Latitude of sub-satellite point
        write("lop", gdsv.getLop());  // Longitude of sub-satellite pt
        write("xp", gdsv.getXp());    // Xp-coordinate of sub-satellite
        write("yp", gdsv.getYp());    // Yp-coordinate of sub-satellite
        write("nr", gdsv.getNr());    // Nr Altitude of the camera
        write("xo", gdsv.getXo());    // Xo-coordinate of origin
        write("yo", gdsv.getYo());    // Yo-coordinate of origin
    }

    private void writeCurvilinearGrid() {
        writeGridShape();
        writeGridSize();
    }

    private void writeGridDefinition() {
        final int gridTemplate = gdsv.getGdtn();

        write("gridDefinition", gridTemplate, codeTable3_1(gridTemplate));  // Grid Name
        write("numberPoints", gdsv.getNumberPoints());  // Number of data points

        switch (gridTemplate) {
            case 0:
            case 1:
            case 2:
            case 3:
                writeLatLongGrid();
                break;
            case 10:
                writeMercatorGrid();
                break;
            case 20:
                writePolarStereographicGrid();
                break;
            case 30:
                writeLambertConformalGrid();
                break;
            case 40:
            case 41:
            case 42:
            case 43:
                writeLatLongGrid();
                break;
            case 90:
                writeSpaceOrOrthographicGrid();
                break;
            case 204:
                writeCurvilinearGrid();
                break;
        }
    }

    void writeHeader() {
        jg.writeStartObject("header");
        writeIndicator();
        writeIdentification();
        writeProduct();
        writeGridDefinition();
        jg.writeEnd();
    }

    void writeData(Grib2Data gd) throws IOException {
        float[] data = gd.getData(record.getGdsOffset(), record.getPdsOffset(), ids.getRefTime());
        if (data != null) {
            jg.writeStartArray("data");
            for (float value : data) {
                jg.write(new FloatValue(value));
            }
            jg.writeEnd();
        }
    }
}
