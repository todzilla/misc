public class Hello extends javax.swing.JComponent
   {
    public static void main(String[] args)
       {
        javax.swing.JFrame frame = new javax.swing.JFrame("Hello");
        frame.setSize(300,300);
        frame.getContentPane().add(new Hello());
        frame.setVisible(true);
       }

    public void paintComponent(java.awt.Graphics g)
       {
        g.drawString("hello, Java!", 125, 95);
       }
   }
