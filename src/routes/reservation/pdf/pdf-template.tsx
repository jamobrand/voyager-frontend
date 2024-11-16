import React, { useEffect, useState } from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Font,
  PDFViewer,
} from "@react-pdf/renderer";
import { format } from "date-fns";
import { ReservationConfirmation } from "../reserve-confirmation";
import { generateQRCode } from "@/lib/utils";
import { pdf } from "@react-pdf/renderer";
import { saveAs } from "file-saver";

// Register custom fonts (optional but recommended for better styling)
try {
    Font.register({
      family: "Inter",
      src: "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2",
    });
  } catch (error) {
    console.error("Failed to register font:", error);
  }

// PDF Styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Inter",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 40,
  },
  logo: {
    width: 120,
    height: 50,
  },
  headerRight: {
    textAlign: "right",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    padding: 5,
    backgroundColor: "#f5f5f5",
  },
  row: {
    flexDirection: "row",
    marginBottom: 8,
  },
  label: {
    width: "30%",
    fontSize: 12,
    color: "#666",
  },
  value: {
    width: "70%",
    fontSize: 12,
  },
  footer: {
    position: "absolute",
    bottom: 40,
    left: 40,
    right: 40,
    textAlign: "center",
    fontSize: 10,
    color: "#666",
  },
  qrCode: {
    width: 100,
    height: 100,
    alignSelf: "center",
    marginVertical: 20,
  },
});

interface BookingConfirmationPDFProps {
    reservation: ReservationConfirmation;
    qrCodeUrl: string;
    logoUrl: string;
  }

export const BookingConfirmationPDF: React.FC<BookingConfirmationPDFProps> = ({
    reservation,
    qrCodeUrl,
    logoUrl,
}) => {
      // Validate required props
  if (!reservation || !qrCodeUrl) {
    console.error('Missing required props for PDF generation');
    return null;
  }

  return (
    <Document>
    <Page size="A4" style={styles.page}>
      {/* Header with logo */}
      <View style={styles.header}>
          {logoUrl && <Image src={logoUrl} style={styles.logo} />}
          <View style={styles.headerRight}>
            <Text>Booking Confirmation</Text>
            <Text style={styles.subtitle}>
              {format(new Date(), "MMMM dd, yyyy")}
            </Text>
          </View>
        </View>

      {/* Booking Reference */}
      <View style={styles.section}>
        <Text style={styles.title}>
          Booking Reference: {reservation.bookingRefNumber}
        </Text>
      </View>

      {/* Guest Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Guest Information</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Name:</Text>
          <Text style={styles.value}>
            {reservation.customer.firstName} {reservation.customer.lastName}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{reservation.customer.email}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Phone:</Text>
          <Text style={styles.value}>{reservation.customer.phone}</Text>
        </View>
      </View>

      {/* Booking Details */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Booking Details</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Chalet:</Text>
          <Text style={styles.value}>{reservation.chalet.name}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Type:</Text>
          <Text style={styles.value}>{reservation.chalet.chaletType}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Check-in:</Text>
          <Text style={styles.value}>
            {format(new Date(reservation.checkIn), "MMMM dd, yyyy")}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Check-out:</Text>
          <Text style={styles.value}>
            {format(new Date(reservation.checkOut), "MMMM dd, yyyy")}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Guests:</Text>
          <Text style={styles.value}>
            {reservation.adults} Adults, {reservation.children} Children
          </Text>
        </View>
      </View>

      {/* Payment Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Payment Information</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Total Amount:</Text>
          <Text style={styles.value}>
            KES {reservation.totalCost.toLocaleString()}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Status:</Text>
          <Text style={styles.value}>{reservation.paymentStatus}</Text>
        </View>
      </View>

      {/* QR Code */}
      <Image src={qrCodeUrl} style={styles.qrCode} />

      {/* Footer */}
      <View style={styles.footer}>
        <Text>
          This is an electronic confirmation. Please present this document
          during check-in.
        </Text>
      </View>
    </Page>
  </Document>
  )

};

export class PDFGenerationService {
  static async generateBookingConfirmationPDF(
    reservation: ReservationConfirmation
  ): Promise<void> {
    try {
         // Generate QR code
         const qrCodeUrl = await generateQRCode(JSON.stringify({
            bookingRef: reservation.bookingRefNumber,
            checkIn: reservation.checkIn,
            checkOut: reservation.checkOut,
          }));

           // Get logo URL (replace with your actual logo path)
      const logoUrl = '/logo.png';

 // Create PDF blob
 const blob = await pdf(
    <BookingConfirmationPDF
      reservation={reservation}
      qrCodeUrl={qrCodeUrl}
      logoUrl={logoUrl}
    />
  ).toBlob();

    // Generate filename
    const fileName = `booking-confirmation-${reservation.bookingRefNumber}.pdf`;


     // Save file
     saveAs(blob, fileName);
    } catch (error) {
      console.error("PDF generation failed:", error);
      throw error;
    }
  }
}

export const PDFPreview: React.FC<{ reservation: ReservationConfirmation }> = ({
    reservation,
  }) => {
    const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
    const [logoUrl] = useState<string>("/logo.png");
  
    useEffect(() => {
      const generateQR = async () => {
        try {
          const qrCode = await generateQRCode(JSON.stringify({
            bookingRef: reservation.bookingRefNumber,
            checkIn: reservation.checkIn,
            checkOut: reservation.checkOut,
          }));
          setQrCodeUrl(qrCode);
        } catch (error) {
          console.error('Failed to generate QR code:', error);
        }
      };
  
      generateQR();
    }, [reservation.bookingRefNumber, reservation.checkIn, reservation.checkOut]);
  
    if (!qrCodeUrl) {
      return <div>Loading PDF preview...</div>;
    }
  
    return (
      <PDFViewer width="100%" height={600}>
        <BookingConfirmationPDF
          reservation={reservation}
          qrCodeUrl={qrCodeUrl}
          logoUrl={logoUrl}
        />
      </PDFViewer>
    );
  };
